import Orders from '../models/orders.model.js';

export const createOrdersService = async (data) => {
    const {
    Order_id,
    Orders_domicile,
    Orders_number,
    Orders_cupon,
    Orders_facture,
    Orders_facture_descripcion,
    Restaurant_id,
    Menu_id,
    User_id
    } = data;
    const newOrder = new Orders({
        Orders_id: Order_id,
        Orders_domicile: Orders_domicile,
        Orders_number: Orders_number,
        Orders_cupon: Orders_cupon,
        Orders_facture: Orders_facture,
        Orders_facture_descripcion: Orders_facture_descripcion,
        Restaurant_id: Restaurant_id,
        Menu_id: Menu_id,
        User_id: User_id
    });
    return await newOrder.save();
};

export const getOrdersService = () => {
    return Orders.find({ estado: true });
};

export const getOrderByIdService = async (id) => {
    const order = await Orders.findById(id);

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
        });
    }

    const byDomicile = await Orders.find({
        estado: true,
        Orders_domicile: searchTerm
    });

    if (byDomicile.length > 0) return byDomicile;

    const byCupon = await Orders.find({
        estado: true,
        Orders_cupon: searchTerm
    });

    if (byCupon.length > 0) return byCupon;

    return await Orders.find({
        estado: true,
        Orders_facture: searchTerm
    });
};

export const updateOrderService = async (id, data) => {
   return await Orders.findByIdAndUpdate(
    {_id: id, estado: true},
    data,
    { new: true }
   );
};

export const deleteOrderService = async (id) => {
    return await Orders.findByIdAndUpdate(
        {_id: id, estado: true},
        { estado: false },
        { new: true }
    );
}

// Backwards-compatible aliases for controller naming inconsistencies
export { createOrdersService as createOrderService };
export { updateOrderService as updateOrdersService };
export { deleteOrderService as deleteOrdersService };

