import { Router } from 'express';
import {
  createDish,
  getDishesByRestaurant,
  getDishById,
  updateDish,
  deleteDish,
  searchDishesByName
} from '../controllers/dish.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// Crear platillo
router.post('/', validateJWT, createDish);

// Obtener platillos por restaurante
router.get('/restaurant/:restaurantId', getDishesByRestaurant);

// Buscar platillos por nombre
router.get('/restaurant/:restaurantId/search', searchDishesByName);

// Obtener platillo por ID
router.get('/:id', getDishById);

// Actualizar platillo
router.put('/:id', validateJWT, updateDish);

// Eliminar platillo
router.delete('/:id', validateJWT, deleteDish);

export default router;
