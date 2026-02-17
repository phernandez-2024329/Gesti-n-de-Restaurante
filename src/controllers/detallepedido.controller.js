import DetallePedidoModel from "../models/DetallePedido.model";

export const createDetallePedido = async (req, res) => {
    try {
        const { pedido, producto, candidadproducto, preciounitario } = req.body;

        const detallePedido = new DetallePedidoModel({
            pedido,
            producto,
            candidadproducto,
            preciounitario,
            total: candidadproducto * preciounitario
        })
        await detallePedido.save()
        res.status(201).json({
            success: true,
            message: "Detalle de pedido creado correctamente",
            detallePedido
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el detalle de pedido",
            error: error.message
        })
    }
};

export const getDetallePedidos = async (req, res) => {
    try {
        const detallePedidos = await DetallePedidoModel.find()
        res.status(200).json({
            success: true,
            detallePedidos
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los detalles de pedidos",
            error: error.message
        })
    }
};

export const getDetallePedidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const detallePedido = await DetallePedidoModel.findById(id);

        if(!detallePedido || !detallePedido.estado) {
            return res.status(404).json({
                success: false,
                message: "Detalle de pedido no encontrado"
            })
        }
        res.status(200).json({
            success: true,
            detallePedido
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el detalle de pedido",
            error: error.message
        })
    }
};

export const updateDetallePedido = async (req, res) => {
    try {
        const { id } = req.params;

        const detallePedido = await DetallePedidoModel.findById(id);

        if(!detallePedido || !detallePedido.estado) {
            return res.status(404).json({
                success: false,
                message: "Detalle de pedido no encontrado"
            })
        }

        res.status(200).json({
            success: true,
            message: "Detalle de pedido actualizado correctamente",
            detallePedido
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el detalle de pedido",
            error: error.message
        })
    }
};

export const deleteDetallePedido = async (req, res) => {
    try {
        const { id } = req.params;

        const detallePedido = await DetallePedidoModel.findById(id);

        if(!detallePedido || !detallePedido.estado) {
            return res.status(404).json({
                success: false,
                message: "Detalle de pedido no encontrado"
            })
        }

        res.status(200).json({
            success: true,
            message: "Detalle de pedido eliminado correctamente",
            detallePedido
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el detalle de pedido",
            error: error.message
        })
    }
}