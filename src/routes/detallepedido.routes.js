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
  deleteDetallePedido
} from '../controllers/detallepedido.controller.js';

const router = Router();

router.post('/', auth, ...validateCreateDetallePedido, createDetallePedido);
router.get('/', auth, getDetallePedidos);
router.get('/:id', auth, ...validateDetallePedidoIdParam, getDetallePedidoById);
router.put('/:id', auth, ...validateUpdateDetallePedido, updateDetallePedido);
router.delete('/:id', auth, ...validateDetallePedidoIdParam, deleteDetallePedido);

export default router;
