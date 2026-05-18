import { Router } from 'express';
import { auth } from '../../middlewares/auth.js';
import {
  validateCreateDetallePedido,
  validateUpdateDetallePedido,
  validateDetallePedidoIdParam
} from '../../middlewares/route-validators.js';
import {
  createDetallePedido,
  getDetallePedidos,
  getDetallePedidoById,
  updateDetallePedido,
  deleteDetallePedido,
  getDetallePedidosByOrder
} from '../controllers/detallepedido.controller.js';

const router = Router();

router.post('/', auth, ...validateCreateDetallePedido, createDetallePedido);
router.get('/', auth, getDetallePedidos);
router.get('/order/:orderId', auth, getDetallePedidosByOrder);
router.get('/:id', auth, ...validateDetallePedidoIdParam, getDetallePedidoById);
router.put('/:id', auth, ...validateUpdateDetallePedido, updateDetallePedido);
router.delete('/:id', auth, ...validateDetallePedidoIdParam, deleteDetallePedido);

export default router;
