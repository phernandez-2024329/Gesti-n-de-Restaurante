import mongoose, { isValidObjectId } from "mongoose";
import DetallePedidoModel from "../models/DetallePedido.model.js";
import Dish from "../models/dish.model.js";
import Beverage from "../models/beverage.model.js";
import Recipe from "../models/recipe.model.js";
import Inventory from "../models/inventory.model.js";
import Orders from "../models/orders.model.js";

const normalizeItems = (data) => {
  if (Array.isArray(data.items) && data.items.length > 0) {
    return data.items;
  }

  if (data.producto && data.productType && data.candidadproducto !== undefined) {
    return [{
      producto: data.producto,
      productType: data.productType,
      candidadproducto: data.candidadproducto
    }];
  }

  return [];
};

const getProductByType = async (productType, productId, restaurantId, session = null) => {
  if (productType === 'dish') {
    return await Dish.findOne({ _id: productId, restaurant_id: restaurantId, estado: true }).session(session);
  }

  if (productType === 'beverage') {
    return await Beverage.findOne({ _id: productId, restaurant_id: restaurantId, estado: true }).session(session);
  }

  return null;
};

const getRecipeByType = async (productType, productId, restaurantId, session = null) => {
  if (productType === 'dish') {
    return await Recipe.findOne({ dish_id: productId, restaurant_id: restaurantId, estado: true }).session(session);
  }

  if (productType === 'beverage') {
    return await Recipe.findOne({ beverage_id: productId, restaurant_id: restaurantId, estado: true }).session(session);
  }

  return null;
};

const createError = (message, code) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

const addRequirement = (requirementsMap, inventoryId, quantity, unit) => {
  const key = String(inventoryId);
  const existing = requirementsMap.get(key);

  if (!existing) {
    requirementsMap.set(key, { quantity, unit });
    return;
  }

  if (existing.unit !== unit) {
    throw createError(`Unidad inconsistente para inventario ${key}: ${existing.unit} vs ${unit}`, 'UNIT_MISMATCH');
  }

  existing.quantity += quantity;
};

const buildRequirementsFromRecipe = (recipe, orderQuantity) => {
  const map = new Map();

  if (!recipe || !Array.isArray(recipe.ingredients)) {
    return map;
  }

  for (const ingredient of recipe.ingredients) {
    addRequirement(
      map,
      ingredient.inventory_id,
      ingredient.quantity * orderQuantity,
      ingredient.unit
    );
  }

  return map;
};

const mergeRequirements = (target, source) => {
  for (const [inventoryId, data] of source.entries()) {
    addRequirement(target, inventoryId, data.quantity, data.unit);
  }
};

const getInventoryMap = async (requirementsMap, restaurantId, session = null) => {
  if (requirementsMap.size === 0) {
    return new Map();
  }

  const inventoryIds = [...requirementsMap.keys()];
  const items = await Inventory.find({
    _id: { $in: inventoryIds },
    restaurant_id: restaurantId,
    estado: true
  }).session(session);

  return new Map(items.map((item) => [String(item._id), item]));
};

const validateRequirements = (requirementsMap, inventoryMap, checkStock = true) => {
  for (const [inventoryId, requirement] of requirementsMap.entries()) {
    const inventoryItem = inventoryMap.get(inventoryId);

    if (!inventoryItem) {
      throw createError(`Artículo de inventario no encontrado: ${inventoryId}`, 'INVENTORY_NOT_FOUND');
    }

    if (inventoryItem.unit !== requirement.unit) {
      throw createError(
        `Unidad no compatible para ${inventoryItem.item_name}. Receta: ${requirement.unit}, Inventario: ${inventoryItem.unit}`,
        'UNIT_MISMATCH'
      );
    }

    if (checkStock && inventoryItem.quantity < requirement.quantity) {
      throw createError(
        `Stock insuficiente para ${inventoryItem.item_name}. Disponible: ${inventoryItem.quantity} ${inventoryItem.unit}, Requerido: ${requirement.quantity} ${inventoryItem.unit}`,
        'INSUFFICIENT_STOCK'
      );
    }
  }
};

const applyDecreaseRequirements = async (requirementsMap, restaurantId, session) => {
  for (const [inventoryId, requirement] of requirementsMap.entries()) {
    const updated = await Inventory.findOneAndUpdate(
      {
        _id: inventoryId,
        restaurant_id: restaurantId,
        estado: true,
        quantity: { $gte: requirement.quantity }
      },
      { $inc: { quantity: -requirement.quantity } },
      { new: true, session }
    );

    if (!updated) {
      throw createError(`No se pudo descontar inventario para ${inventoryId}`, 'INSUFFICIENT_STOCK');
    }
  }
};

const applyIncreaseRequirements = async (requirementsMap, restaurantId, session) => {
  for (const [inventoryId, requirement] of requirementsMap.entries()) {
    const updated = await Inventory.findOneAndUpdate(
      {
        _id: inventoryId,
        restaurant_id: restaurantId,
        estado: true
      },
      { $inc: { quantity: requirement.quantity } },
      { new: true, session }
    );

    if (!updated) {
      throw createError(`No se pudo restaurar inventario para ${inventoryId}`, 'INVENTORY_NOT_FOUND');
    }
  }
};

const calculateDeltaRequirements = (oldRequirements, newRequirements) => {
  const delta = new Map();
  const keys = new Set([...oldRequirements.keys(), ...newRequirements.keys()]);

  for (const key of keys) {
    const oldValue = oldRequirements.get(key);
    const newValue = newRequirements.get(key);
    const oldQty = oldValue ? oldValue.quantity : 0;
    const newQty = newValue ? newValue.quantity : 0;
    const diff = newQty - oldQty;

    if (diff === 0) {
      continue;
    }

    const unit = newValue ? newValue.unit : oldValue.unit;
    delta.set(key, { quantity: diff, unit });
  }

  return delta;
};

const splitDeltaRequirements = (deltaRequirements) => {
  const toDecrease = new Map();
  const toIncrease = new Map();

  for (const [inventoryId, data] of deltaRequirements.entries()) {
    if (data.quantity > 0) {
      toDecrease.set(inventoryId, { quantity: data.quantity, unit: data.unit });
      continue;
    }

    toIncrease.set(inventoryId, { quantity: Math.abs(data.quantity), unit: data.unit });
  }

  return { toDecrease, toIncrease };
};

export const createDetallePedidoService = async (data) => {
  const { orders_id } = data;
  const items = normalizeItems(data);

  if (!isValidObjectId(orders_id)) {
    const err = new Error('ID de orden no válido');
    err.code = 'INVALID_ID';
    throw err;
  }

  const order = await Orders.findOne({ _id: orders_id, estado: true });

  if (!order) {
    const err = new Error('La orden no existe o está inactiva');
    err.code = 'ORDER_NOT_FOUND';
    throw err;
  }

  const restaurant_id = order.Restaurant_id;

  if (!items.length) {
    throw createError('Debe enviar al menos un producto en items o producto/productType/candidadproducto', 'INVALID_ITEMS');
  }

  const session = await mongoose.startSession();

  try {
    let result = null;

    await session.withTransaction(async () => {
      const orderTx = await Orders.findOne({ _id: orders_id, estado: true }).session(session);

      if (!orderTx) {
        throw createError('La orden no existe o está inactiva', 'ORDER_NOT_FOUND');
      }

      const restaurantIdTx = orderTx.Restaurant_id;
      const preparedItems = [];
      const requiredInventory = new Map();

      for (const item of items) {
        const { producto, productType, candidadproducto } = item;

        if (!isValidObjectId(producto)) {
          throw createError('ID de producto no válido', 'INVALID_ID');
        }

        if (!['dish', 'beverage'].includes(productType)) {
          throw createError('productType debe ser "dish" o "beverage"', 'INVALID_PRODUCT_TYPE');
        }

        const quantity = Number(candidadproducto);

        if (!Number.isFinite(quantity) || quantity < 1) {
          throw createError('candidadproducto debe ser un número mayor o igual a 1', 'INVALID_QUANTITY');
        }

        const product = await getProductByType(productType, producto, restaurantIdTx, session);

        if (!product) {
          throw createError(`No se encontró el producto ${producto} para el restaurante de la orden`, 'PRODUCT_NOT_FOUND');
        }

        const recipe = await getRecipeByType(productType, producto, restaurantIdTx, session);

        if (!recipe) {
          throw createError(`No hay receta activa para el producto ${producto}`, 'RECIPE_NOT_FOUND');
        }

        const total = product.price * quantity;
        const itemRequirements = buildRequirementsFromRecipe(recipe, quantity);

        mergeRequirements(requiredInventory, itemRequirements);

        preparedItems.push({
          orders_id,
          producto,
          productType,
          recipe_id: recipe._id,
          candidadproducto: quantity,
          total,
          restaurant_id: restaurantIdTx
        });
      }

      const inventoryMap = await getInventoryMap(requiredInventory, restaurantIdTx, session);
      validateRequirements(requiredInventory, inventoryMap, true);
      await applyDecreaseRequirements(requiredInventory, restaurantIdTx, session);

      const createdDetails = await DetallePedidoModel.insertMany(preparedItems, { session });
      const detalleIds = createdDetails.map((detalle) => detalle._id);

      await Orders.findByIdAndUpdate(
        orders_id,
        { $push: { detallePedidos: { $each: detalleIds } } },
        { new: true, session }
      );

      result = createdDetails.length === 1 ? createdDetails[0] : createdDetails;
    });

    return result;
  } finally {
    await session.endSession();
  }
};

export const  getDetallePedidosService = async () => {
  return await DetallePedidoModel.find({ estado: true })
    .populate("orders_id")
    .populate("producto")
    .populate("recipe_id");
};

export const getDetallePedidoByIdService = async (id) => {
  return await DetallePedidoModel.findOne({ _id: id, estado: true })
    .populate("orders_id")
    .populate("producto")
    .populate("recipe_id");
};

export const updateDetallePedidoService = async (id, data) => {
  if (!isValidObjectId(id)) {
    throw createError('ID de detalle no válido', 'INVALID_ID');
  }

  const session = await mongoose.startSession();

  try {
    let updated = null;

    await session.withTransaction(async () => {
      const detalleActual = await DetallePedidoModel.findOne({ _id: id, estado: true }).session(session);

      if (!detalleActual) {
        updated = null;
        return;
      }

      const order = await Orders.findOne({ _id: detalleActual.orders_id, estado: true }).session(session);

      if (!order) {
        throw createError('La orden asociada no existe o está inactiva', 'ORDER_NOT_FOUND');
      }

      const restaurantId = order.Restaurant_id;
      const nextProductId = data.producto || detalleActual.producto;
      const nextProductType = data.productType || detalleActual.productType;
      const nextQuantity = data.candidadproducto !== undefined ? Number(data.candidadproducto) : Number(detalleActual.candidadproducto);

      if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
        throw createError('candidadproducto debe ser un número mayor o igual a 1', 'INVALID_QUANTITY');
      }

      const nextProduct = await getProductByType(nextProductType, nextProductId, restaurantId, session);

      if (!nextProduct) {
        throw createError(`No se encontró el producto ${nextProductId} para el restaurante de la orden`, 'PRODUCT_NOT_FOUND');
      }

      const currentRecipe = await getRecipeByType(detalleActual.productType, detalleActual.producto, restaurantId, session);
      const nextRecipe = await getRecipeByType(nextProductType, nextProductId, restaurantId, session);

      if (!currentRecipe || !nextRecipe) {
        throw createError('No hay receta activa para recalcular el inventario de este detalle', 'RECIPE_NOT_FOUND');
      }

      const currentRequirements = buildRequirementsFromRecipe(currentRecipe, Number(detalleActual.candidadproducto));
      const nextRequirements = buildRequirementsFromRecipe(nextRecipe, nextQuantity);
      const deltaRequirements = calculateDeltaRequirements(currentRequirements, nextRequirements);
      const { toDecrease, toIncrease } = splitDeltaRequirements(deltaRequirements);

      const inventoryToCheck = new Map([...toDecrease, ...toIncrease]);
      const inventoryMap = await getInventoryMap(inventoryToCheck, restaurantId, session);
      validateRequirements(inventoryToCheck, inventoryMap, false);
      validateRequirements(toDecrease, inventoryMap, true);

      await applyDecreaseRequirements(toDecrease, restaurantId, session);
      await applyIncreaseRequirements(toIncrease, restaurantId, session);

      const updateData = {
        producto: nextProductId,
        productType: nextProductType,
        recipe_id: nextRecipe._id,
        candidadproducto: nextQuantity,
        total: nextProduct.price * nextQuantity
      };

      updated = await DetallePedidoModel.findOneAndUpdate(
        { _id: id, estado: true },
        updateData,
        { new: true, session }
      );
    });

    return updated;
  } finally {
    await session.endSession();
  }
};

export const deleteDetallePedidoService = async (id) => {
  if (!isValidObjectId(id)) {
    throw createError('ID de detalle no válido', 'INVALID_ID');
  }

  const session = await mongoose.startSession();

  try {
    let deleted = null;

    await session.withTransaction(async () => {
      const detalle = await DetallePedidoModel.findOne({ _id: id, estado: true }).session(session);

      if (!detalle) {
        deleted = null;
        return;
      }

      const order = await Orders.findOne({ _id: detalle.orders_id, estado: true }).session(session);
      const restaurantId = order ? order.Restaurant_id : detalle.restaurant_id;

      const recipe = await getRecipeByType(detalle.productType, detalle.producto, restaurantId, session);

      if (!recipe) {
        throw createError('No hay receta activa para devolver inventario del detalle', 'RECIPE_NOT_FOUND');
      }

      const requirements = buildRequirementsFromRecipe(recipe, Number(detalle.candidadproducto));
      const inventoryMap = await getInventoryMap(requirements, restaurantId, session);
      validateRequirements(requirements, inventoryMap, false);
      await applyIncreaseRequirements(requirements, restaurantId, session);

      deleted = await DetallePedidoModel.findOneAndUpdate(
        { _id: id, estado: true },
        { estado: false },
        { new: true, session }
      );

      if (order) {
        await Orders.findByIdAndUpdate(
          order._id,
          { $pull: { detallePedidos: detalle._id } },
          { session }
        );
      }
    });

    return deleted;
  } finally {
    await session.endSession();
  }
};

export const getDetallePedidosByOrderService = async (orderId) => {
  return await DetallePedidoModel.find({ orders_id: orderId, estado: true })
    .populate("producto")
    .populate("recipe_id");
};
