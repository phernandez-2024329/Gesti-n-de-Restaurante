import { isValidObjectId } from 'mongoose';
import Inventory from '../models/inventory.model.js';

export const createInventoryService = async (data) => {
  const item = new Inventory(data);
  return await item.save();
};

export const getInventoryByRestaurantService = async (restaurantId) => {
  return await Inventory.find({ restaurant_id: restaurantId, estado: true })
    .populate('restaurant_id');
};

export const getInventoryByIdService = async (id) => {
  return await Inventory.findOne({ _id: id, estado: true })
    .populate('restaurant_id');
};

export const getInventoryByNameAndRestaurantService = async (name, restaurantId) => {
  return await Inventory.findOne({ 
    restaurant_id: restaurantId, 
    item_name: name, 
    estado: true 
  }).populate('restaurant_id');
};

export const updateInventoryService = async (id, data) => {
  return await Inventory.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('restaurant_id');
};

export const deleteInventoryService = async (id) => {
  return await Inventory.findByIdAndUpdate(id, { estado: false }, { new: true });
};

export const decreaseInventoryService = async (inventoryId, quantity, restaurantId = null) => {
  if (!isValidObjectId(inventoryId)) {
    const error = new Error('ID de inventario no válido');
    error.code = 'INVALID_ID';
    throw error;
  }

  const baseQuery = {
    _id: inventoryId,
    estado: true,
    quantity: { $gte: quantity }
  };

  if (restaurantId) {
    baseQuery.restaurant_id = restaurantId;
  }

  const updatedItem = await Inventory.findOneAndUpdate(
    baseQuery,
    { $inc: { quantity: -quantity } },
    { new: true, runValidators: true }
  ).populate('restaurant_id');

  if (updatedItem) {
    return updatedItem;
  }

  const existingItem = await Inventory.findOne({ _id: inventoryId, estado: true }).populate('restaurant_id');

  if (!existingItem) {
    const error = new Error('Artículo de inventario no encontrado');
    error.code = 'INVENTORY_NOT_FOUND';
    throw error;
  }

  if (restaurantId && String(existingItem.restaurant_id?._id || existingItem.restaurant_id) !== String(restaurantId)) {
    const error = new Error('El artículo de inventario no pertenece al restaurante de la orden');
    error.code = 'INVENTORY_RESTAURANT_MISMATCH';
    throw error;
  }

  const error = new Error(`Stock insuficiente. Disponible: ${existingItem.quantity}, solicitado: ${quantity}`);
  error.code = 'INSUFFICIENT_STOCK';
  throw error;
};

export const increaseInventoryService = async (inventoryId, quantity) => {
  return await Inventory.findByIdAndUpdate(
    inventoryId,
    { $inc: { quantity: quantity } },
    { new: true }
  ).populate('restaurant_id');
};

export const searchInventoryByNameService = async (name, restaurantId) => {
  return await Inventory.find({
    restaurant_id: restaurantId,
    estado: true,
    item_name: { $regex: name, $options: 'i' }
  }).populate('restaurant_id');
};
