import { Router } from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  getInvoicesByOrder,
  getInvoicesByRestaurant,
  updateInvoice,
  deleteInvoice
} from '../controllers/invoice.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// Crear factura
router.post('/', validateJWT, createInvoice);

// Obtener todas las facturas
router.get('/', validateJWT, getInvoices);

// Obtener factura por ID
router.get('/:id', validateJWT, getInvoiceById);

// Obtener facturas por orden
router.get('/order/:orderId', validateJWT, getInvoicesByOrder);

// Obtener facturas por restaurante
router.get('/restaurant/:restaurantId', validateJWT, getInvoicesByRestaurant);

// Actualizar factura
router.put('/:id', validateJWT, updateInvoice);

// Eliminar factura (soft delete)
router.delete('/:id', validateJWT, deleteInvoice);

export default router;
