import { Router } from 'express';
import {
  createBeverage,
  getBeveragesByRestaurant,
  getBeverageById,
  updateBeverage,
  deleteBeverage,
  searchBeveragesByName
} from '../controllers/beverage.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// Crear bebida
router.post('/', validateJWT, createBeverage);

// Obtener bebidas por restaurante
router.get('/restaurant/:restaurantId', getBeveragesByRestaurant);

// Buscar bebidas por nombre
router.get('/restaurant/:restaurantId/search', searchBeveragesByName);

// Obtener bebida por ID
router.get('/:id', getBeverageById);

// Actualizar bebida
router.put('/:id', validateJWT, updateBeverage);

// Eliminar bebida
router.delete('/:id', validateJWT, deleteBeverage);

export default router;
