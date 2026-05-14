import {
  createInvoiceService,
  getInvoicesService,
  getInvoiceByIdService,
  getInvoicesByOrderService,
  getInvoicesByRestaurantService,
  updateInvoiceService,
  deleteInvoiceService
} from '../services/invoice.service.js';

export const createInvoice = async (req, res) => {
  try {
    const invoice = await createInvoiceService(req.body);
    res.status(201).json({
      success: true,
      message: 'Factura creada exitosamente',
      data: invoice
    });
  } catch (error) {
    if (error.code === 'INCOMPLETE_INVOICE') {
      return res.status(400).json({
        success: false,
        message: 'Factura incompleta',
        error: error.message
      });
    }
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: 'IDs no válidos',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear la factura',
      error: error.message
    });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await getInvoicesService();
    res.status(200).json({
      success: true,
      message: 'Facturas obtenidas exitosamente',
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las facturas',
      error: error.message
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await getInvoiceByIdService(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Factura obtenida exitosamente',
      data: invoice
    });
  } catch (error) {
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: 'ID de factura no válido',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener la factura',
      error: error.message
    });
  }
};

export const getInvoicesByOrder = async (req, res) => {
  try {
    const invoices = await getInvoicesByOrderService(req.params.orderId);
    res.status(200).json({
      success: true,
      message: 'Facturas de la orden obtenidas exitosamente',
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: 'ID de orden no válido',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener las facturas',
      error: error.message
    });
  }
};

export const getInvoicesByRestaurant = async (req, res) => {
  try {
    const invoices = await getInvoicesByRestaurantService(req.params.restaurantId);
    res.status(200).json({
      success: true,
      message: 'Facturas del restaurante obtenidas exitosamente',
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: 'ID de restaurante no válido',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener las facturas',
      error: error.message
    });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await updateInvoiceService(req.params.id, req.body);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Factura actualizada exitosamente',
      data: invoice
    });
  } catch (error) {
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: 'ID de factura no válido',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la factura',
      error: error.message
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await deleteInvoiceService(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Factura eliminada exitosamente'
    });
  } catch (error) {
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: 'ID de factura no válido',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la factura',
      error: error.message
    });
  }
};
