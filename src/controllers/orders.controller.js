import {
    createOrdersService,
    getOrdersService,
    getOrderByIdService,
    searchOrdersService,
    updateOrderService,
    deleteOrderService
} from '../services/orders.service.js';

export const createOrder = async (req, res) => {
    try {
        const data = { ...req.body };
        if (!data.User_id && req.user?.id) {
            data.User_id = req.user.id;
        }
        const order = await createOrdersService(data);
        res.status(201).json({
            message: "Orden creada exitosamente",
            data: order
        });
    } catch (error) {
        if (error.code === 'INCOMPLETE_ORDER') {
            return res.status(400).json({
                success: false,
                message: "Pedido incompleto",
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: "Error al crear la orden",
            error: error.message
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await getOrdersService();
        res.status(200).json({
            message: "Órdenes obtenidas exitosamente",
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las órdenes",
            error: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await getOrderByIdService(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada"
            });
        }
        res.status(200).json({
            message: "Orden obtenida exitosamente",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la orden",
            error: error.message
        });
    }
};

export const searchOrders = async (req, res) => {
    try {
        const { searchTerm } = req.query;

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: "El término de búsqueda es obligatorio"
            });
        }

        const orders = await searchOrdersService(searchTerm);

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron órdenes con el término proporcionado"
            });
        }

        return res.status(200).json({
            message: "Búsqueda de órdenes completada",
            count: orders.length,
            data: orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al procesar la búsqueda de órdenes",
            error: error.message
        });
    }
};

export const updateOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "El ID de la orden es obligatorio"
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionaron datos para actualizar"
            });
        }

        const order = await updateOrderService(id, updateData);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada"
            });
        }

        return res.status(200).json({
            message: "Orden actualizada exitosamente",
            data: order
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID de orden no válido",
                error: "INVALID_ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error al actualizar la orden",
            error: error.message
        });
    }
};

export const deleteOrders = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "El ID de la orden es obligatorio"
            });
        }

        const order = await deleteOrderService(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada"
            });
        }

        return res.status(200).json({
            message: "Orden eliminada exitosamente",
            data: order
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID de orden no válido",
                error: "INVALID_ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error al eliminar la orden",
            error: error.message
        });
    }
};