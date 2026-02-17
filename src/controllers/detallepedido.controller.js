import {
  createDetallePedidoService,
  getDetallePedidosService,
  getDetallePedidoByIdService,
  updateDetallePedidoService,
  deleteDetallePedidoService
} from "../services/detallePedido.service.js";

export const createDetallePedido = async (req, res) => {
  try {
    const detallePedido = await createDetallePedidoService(req.body);

    res.status(201).json({
      success: true,
      message: "Detalle de pedido creado correctamente",
      detallePedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el detalle de pedido",
      error: error.message
    });
  }
};

export const getDetallePedidos = async (req, res) => {
  try {
    const detallePedidos = await getDetallePedidosService();

    res.status(200).json({
      success: true,
      detallePedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los detalles de pedidos",
      error: error.message
    });
  }
};

export const getDetallePedidoById = async (req, res) => {
  try {
    const detallePedido = await getDetallePedidoByIdService(req.params.id);

    if (!detallePedido) {
      return res.status(404).json({
        success: false,
        message: "Detalle de pedido no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      detallePedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el detalle de pedido",
      error: error.message
    });
  }
};

export const updateDetallePedido = async (req, res) => {
  try {
    const detallePedido = await updateDetallePedidoService(
      req.params.id,
      req.body
    );

    if (!detallePedido) {
      return res.status(404).json({
        success: false,
        message: "Detalle de pedido no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Detalle de pedido actualizado correctamente",
      detallePedido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar el detalle de pedido",
      error: error.message
    });
  }
};

export const deleteDetallePedido = async (req, res) => {
  try {
    const detallePedido = await deleteDetallePedidoService(req.params.id);

    if (!detallePedido) {
      return res.status(404).json({
        success: false,
        message: "Detalle de pedido no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Detalle de pedido eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el detalle de pedido",
      error: error.message
    });
  }
};
