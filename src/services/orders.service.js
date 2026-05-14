import Orders from '../models/orders.model.js';
import Counter from '../models/counter.model.js';
import { isValidObjectId } from 'mongoose';

export const createOrdersService = async (data) => {
    const {
    Orders_domicile,
    Orders_cupon,
    Restaurant_id,
    Menu_id,
    User_id
    } = data;

    if (!Orders_domicile || !Restaurant_id || !Menu_id || !User_id) {
        const err = new Error('Pedido incompleto: faltan campos obligatorios (dirección, restaurante, menú o usuario).');
        err.code = 'INCOMPLETE_ORDER';
        throw err;
    }

    // Obtener número de orden desde Counter sin usar update pipeline
    // Primer paso: asegurar que exista el contador con base 99
    await Counter.findOneAndUpdate(
        { _id: 'orders' },
        { $setOnInsert: { seq: 99 } },
        { new: true, upsert: true }
    );

    // Segundo paso: incrementar y leer el valor resultante (100, 101, 102...)
    const counter = await Counter.findOneAndUpdate(
        { _id: 'orders' },
        { $inc: { seq: 1 } },
        { new: true }
    );

    const generatedNumber = counter.seq;
    const generatedId = String(generatedNumber);

    const newOrder = new Orders({
        Orders_id: generatedId,
        Orders_domicile: Orders_domicile,
        Orders_number: generatedNumber,
        Orders_cupon: Orders_cupon || null,
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

    // No se encontró por número, domicilio ni cupón
    return [];
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

