import {
  createDetallePedidoService,
  getDetallePedidosService,
  getDetallePedidoByIdService,
  updateDetallePedidoService,
  deleteDetallePedidoService,
  getDetallePedidosByOrderService
} from "../services/detallepedido.service.js";

export const createDetallePedido = async (req, res) => {
  try {
    const detallePedido = await createDetallePedidoService(req.body);
    const count = Array.isArray(detallePedido) ? detallePedido.length : 1;

    res.status(201).json({
      success: true,
      message: "Detalle de pedido creado correctamente y inventario actualizado",
      count,
      detallePedido
    });
  } catch (error) {
    // Validar si es error de stock insuficiente
    if (error.code === 'INSUFFICIENT_STOCK') {
      return res.status(400).json({
        success: false,
        message: "Stock insuficiente para completar la orden",
        error: error.message,
        code: error.code
      });
    }

    if (error.code === 'INVALID_PRODUCT_TYPE') {
      return res.status(400).json({
        success: false,
        message: "Tipo de producto inválido",
        error: error.message,
        code: error.code
      });
    }

    if (error.code === 'INVALID_ITEMS' || error.code === 'INVALID_QUANTITY' || error.code === 'PRODUCT_NOT_FOUND' || error.code === 'ORDER_NOT_FOUND') {
      return res.status(400).json({
        success: false,
        message: "Error de validación en el detalle de pedido",
        error: error.message,
        code: error.code
      });
    }

    if (error.code === 'RECIPE_NOT_FOUND' || error.code === 'UNIT_MISMATCH') {
      return res.status(400).json({
        success: false,
        message: "No fue posible procesar inventario con la receta del producto",
        error: error.message,
        code: error.code
      });
    }

    if (error.code === 'INVENTORY_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: "Artículo de inventario no encontrado",
        error: error.message,
        code: error.code
      });
    }

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

export const getDetallePedidosByOrder = async (req, res) => {
  try {
    const detallePedidos = await getDetallePedidosByOrderService(req.params.orderId);

    res.status(200).json({
      success: true,
      detallePedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los detalles de la orden",
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
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: "ID de detalle no válido",
        error: error.message,
        code: error.code
      });
    }

    if (error.code === 'INVALID_QUANTITY' || error.code === 'PRODUCT_NOT_FOUND' || error.code === 'ORDER_NOT_FOUND' || error.code === 'RECIPE_NOT_FOUND' || error.code === 'UNIT_MISMATCH' || error.code === 'INSUFFICIENT_STOCK') {
      return res.status(400).json({
        success: false,
        message: "No fue posible actualizar el detalle de pedido",
        error: error.message,
        code: error.code
      });
    }

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
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: "ID de detalle no válido",
        error: error.message,
        code: error.code
      });
    }

    if (error.code === 'RECIPE_NOT_FOUND' || error.code === 'UNIT_MISMATCH' || error.code === 'INVENTORY_NOT_FOUND') {
      return res.status(400).json({
        success: false,
        message: "No fue posible restaurar inventario para eliminar el detalle",
        error: error.message,
        code: error.code
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al eliminar el detalle de pedido",
      error: error.message
    });
  }
};
