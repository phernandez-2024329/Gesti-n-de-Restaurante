import { isValidObjectId } from "mongoose";
import DetallePedidoModel from "../models/DetallePedido.model.js";
import Recipe from "../models/recipe.model.js";
import Inventory from "../models/inventory.model.js";
import Orders from "../models/orders.model.js";
import { decreaseInventoryService } from "./inventory.service.js";

export const createDetallePedidoService = async (data) => {
  const { orders_id, producto, productType, candidadproducto, preciounitario, restaurant_id } = data;

  if (!isValidObjectId(orders_id)) {
    const err = new Error('ID de orden no válido');
    err.code = 'INVALID_ID';
    throw err;
  }

  if (!isValidObjectId(producto)) {
    const err = new Error('ID de producto no válido');
    err.code = 'INVALID_ID';
    throw err;
  }

  if (!isValidObjectId(restaurant_id)) {
    const err = new Error('ID de restaurante no válido');
    err.code = 'INVALID_ID';
    throw err;
  }

  // Validar que el producto y tipo sean válidos
  if (!['dish', 'beverage'].includes(productType)) {
    const err = new Error('productType debe ser "dish" o "beverage"');
    err.code = 'INVALID_PRODUCT_TYPE';
    throw err;
  }

  // Calcular total
  const total = candidadproducto * preciounitario;

  // Obtener la Recipe según el tipo de producto
  let recipe = null;
  if (productType === 'dish') {
    recipe = await Recipe.findOne({ dish_id: producto, estado: true });
  } else if (productType === 'beverage') {
    recipe = await Recipe.findOne({ beverage_id: producto, estado: true });
  }

  // Si no existe recipe, crear el detalle sin consumir inventario
  // (es válido si el producto no tiene receta definida)
  if (recipe && recipe.ingredients && recipe.ingredients.length > 0) {
    // Validar stock disponible para todos los ingredientes ANTES de hacer nada
    for (const ingredient of recipe.ingredients) {
      const inventoryItem = await Inventory.findOne({
        _id: ingredient.inventory_id,
        restaurant_id,
        estado: true
      });
      
      if (!inventoryItem) {
        const err = new Error(`Artículo de inventario no encontrado: ${ingredient.inventory_id}`);
        err.code = 'INVENTORY_NOT_FOUND';
        throw err;
      }

      const requiredQuantity = ingredient.quantity * candidadproducto;
      
      if (inventoryItem.quantity < requiredQuantity) {
        const err = new Error(
          `Stock insuficiente para ${inventoryItem.item_name}. ` +
          `Disponible: ${inventoryItem.quantity} ${inventoryItem.unit}, ` +
          `Requerido: ${requiredQuantity} ${inventoryItem.unit}`
        );
        err.code = 'INSUFFICIENT_STOCK';
        throw err;
      }
    }

    // Si todo está disponible, consumir los ingredientes
    for (const ingredient of recipe.ingredients) {
      const requiredQuantity = ingredient.quantity * candidadproducto;
      await decreaseInventoryService(ingredient.inventory_id, requiredQuantity, restaurant_id);
    }
  }

  // Crear el DetallePedido
  const detallePedido = new DetallePedidoModel({
    orders_id,
    producto,
    productType,
    recipe_id: recipe ? recipe._id : null,
    candidadproducto,
    preciounitario,
    total,
    restaurant_id
  });

  const savedDetalle = await detallePedido.save();

  // Agregar el detallePedido al array de la Order
  if (orders_id) {
    await Orders.findByIdAndUpdate(
      orders_id,
      { $push: { detallePedidos: savedDetalle._id } },
      { new: true }
    );
  }

  return savedDetalle;
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
  if (data.candidadproducto && data.preciounitario) {
    data.total = data.candidadproducto * data.preciounitario;
  }

  return await DetallePedidoModel.findOneAndUpdate(
    { _id: id, estado: true },
    data,
    { new: true }
  );
};

export const deleteDetallePedidoService = async (id) => {
  return await DetallePedidoModel.findOneAndUpdate(
    { _id: id },
    { estado: false },
    { new: true }
  );
};

export const getDetallePedidosByOrderService = async (orderId) => {
  return await DetallePedidoModel.find({ orders_id: orderId, estado: true })
    .populate("producto")
    .populate("recipe_id");
};
