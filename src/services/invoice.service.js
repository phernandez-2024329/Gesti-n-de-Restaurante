import Invoice from '../models/invoice.model.js';
import { isValidObjectId } from 'mongoose';

export const createInvoiceService = async (data) => {
  const { invoice_number, invoice_description, orders_id, restaurant_id, user_id, subtotal, tax, discount, total } = data;

  if (!invoice_number || !orders_id || !restaurant_id || !user_id || !subtotal || total === undefined) {
    const err = new Error('Factura incompleta: faltan campos obligatorios');
    err.code = 'INCOMPLETE_INVOICE';
    throw err;
  }

  if (!isValidObjectId(orders_id) || !isValidObjectId(restaurant_id) || !isValidObjectId(user_id)) {
    const err = new Error('IDs no válidos');
    err.code = 'INVALID_ID';
    throw err;
  }

  const invoice = new Invoice({
    invoice_number,
    invoice_description,
    orders_id,
    restaurant_id,
    user_id,
    subtotal,
    tax: tax || 0,
    discount: discount || 0,
    total
  });

  return await invoice.save();
};

export const getInvoicesService = async () => {
  return await Invoice.find({ estado: true })
    .populate('orders_id')
    .populate('restaurant_id')
    .populate('user_id');
};

export const getInvoiceByIdService = async (id) => {
  if (!isValidObjectId(id)) {
    const err = new Error('ID no válido');
    err.code = 'INVALID_ID';
    throw err;
  }

  return await Invoice.findOne({ _id: id, estado: true })
    .populate('orders_id')
    .populate('restaurant_id')
    .populate('user_id');
};

export const getInvoicesByOrderService = async (ordersId) => {
  if (!isValidObjectId(ordersId)) {
    const err = new Error('ID de orden no válido');
    err.code = 'INVALID_ID';
    throw err;
  }

  return await Invoice.find({ orders_id: ordersId, estado: true })
    .populate('restaurant_id')
    .populate('user_id');
};

export const getInvoicesByRestaurantService = async (restaurantId) => {
  if (!isValidObjectId(restaurantId)) {
    const err = new Error('ID de restaurante no válido');
    err.code = 'INVALID_ID';
    throw err;
  }

  return await Invoice.find({ restaurant_id: restaurantId, estado: true })
    .populate('orders_id')
    .populate('user_id');
};

export const updateInvoiceService = async (id, data) => {
  if (!isValidObjectId(id)) {
    const err = new Error('ID no válido');
    err.code = 'INVALID_ID';
    throw err;
  }

  return await Invoice.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  )
    .populate('orders_id')
    .populate('restaurant_id')
    .populate('user_id');
};

export const deleteInvoiceService = async (id) => {
  if (!isValidObjectId(id)) {
    const err = new Error('ID no válido');
    err.code = 'INVALID_ID';
    throw err;
  }

  return await Invoice.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
};
