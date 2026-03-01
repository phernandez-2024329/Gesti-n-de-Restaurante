import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
    createOrder,
    getOrders,
    getOrderById,
    searchOrders,
    updateOrders,
    deleteOrders
} from '../controllers/orders.controller.js';

const router = Router();

router.post('/',
      validateJWT, createOrder);

router.get('/', 
      validateJWT, getOrders);

router.get('/search',
 validateJWT, searchOrders);

router.get('/:id',
    validateJWT, getOrderById);

router.put('/:id',
    validateJWT, updateOrders);

router.delete('/:id'
, validateJWT, deleteOrders);


export default router;