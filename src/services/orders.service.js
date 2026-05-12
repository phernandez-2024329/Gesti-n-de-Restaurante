import Orders from '../models/orders.model.js';
import crypto from 'crypto';
import { isValidObjectId } from 'mongoose';

export const createOrdersService = async (data) => {
    const {
    Orders_id,
    Orders_domicile,
    Orders_number,
    Orders_cupon,
    Orders_facture,
    Orders_facture_descripcion,
    Restaurant_id,
    Menu_id,
    User_id
    } = data;

    if (!Orders_domicile || !Orders_number || !Orders_facture || !Orders_facture_descripcion || !Restaurant_id || !Menu_id || !User_id) {
        const err = new Error('Pedido incompleto: faltan campos obligatorios (dirección, número orden, factura, descripción, restaurante, menú o usuario).');
        err.code = 'INCOMPLETE_ORDER';
        throw err;
    }

    const finalOrderId = Orders_id || `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const newOrder = new Orders({
        Orders_id: finalOrderId,
        Orders_domicile: Orders_domicile,
        Orders_number: Orders_number,
        Orders_cupon: Orders_cupon || null,
        Orders_facture: Orders_facture,
        Orders_facture_descripcion: Orders_facture_descripcion,
        Restaurant_id: Restaurant_id,
        Menu_id: Menu_id,
        User_id: User_id,
        detallePedidos: []
    });
    return await newOrder.save();
};

export const getOrdersService = () => {
    return Orders.find({ estado: true })
        .populate('Restaurant_id')
        .populate('User_id')
        .populate({
            path: 'detallePedidos',
            populate: [
                { path: 'producto' },
                { path: 'recipe_id' }
            ]
        });
};

export const getOrderByIdService = async (id) => {
    if (!isValidObjectId(id)) {
        const err = new Error('ID no válido');
        err.code = 'INVALID_ID';
        throw err;
    }

    const order = await Orders.findById(id);

    if (!order || !order.estado) {
        return null;
    }

    return order;
};

export const getOrderByIdWithDetailsService = async (id) => {
    if (!isValidObjectId(id)) {
        const err = new Error('ID no válido');
        err.code = 'INVALID_ID';
        throw err;
    }

    const order = await Orders.findById(id)
        .populate('Restaurant_id')
        .populate('User_id')
        .populate({
            path: 'detallePedidos',
            populate: [
                { path: 'producto' },
                { path: 'recipe_id' }
            ]
        });

    if (!order || !order.estado) {
        return null;
    }

    return order;
};

export const searchOrdersService = async (searchTerm) => {
    const numericTerm = Number(searchTerm);

    if (!isNaN(numericTerm)) {
        return await Orders.find({
            estado: true,
            Orders_number: numericTerm
        }).populate('detallePedidos');
    }

    const byDomicile = await Orders.find({
        estado: true,
        Orders_domicile: searchTerm
    }).populate('detallePedidos');

    if (byDomicile.length > 0) return byDomicile;

    const byCupon = await Orders.find({
        estado: true,
        Orders_cupon: searchTerm
    }).populate('detallePedidos');

    if (byCupon.length > 0) return byCupon;

    return await Orders.find({
        estado: true,
        Orders_facture: searchTerm
    }).populate('detallePedidos');
};

export const updateOrderService = async (id, data) => {
   return await Orders.findOneAndUpdate(
    { _id: id, estado: true },
    data,
    { new: true, runValidators: true }
   ).populate('detallePedidos');
};

export const deleteOrderService = async (id) => {
    return await Orders.findOneAndUpdate(
        { _id: id, estado: true },
        { estado: false },
        { new: true }
    );
};

// Backwards-compatible aliases for controller naming inconsistencies
export { createOrdersService as createOrderService };
export { updateOrderService as updateOrdersService };
export { deleteOrderService as deleteOrdersService };

