import { Router } from 'express';
import multer from 'multer';
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurant.controller.js';


import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { Roles } from '../constants/roles.js';

const upload = multer({ dest: 'uploads/' });

const router = Router();

// Crear restaurante (ADMIN o GERENTE)
router.post(
  '/',
  upload.single('restaurant_images'),
  validateJWT,
  validateRole(Roles.ADMIN, Roles.GERENTE),
  createRestaurant
);

// Listar restaurantes
router.get('/', validateJWT, getRestaurants);

// Obtener por id
router.get('/:id', validateJWT, getRestaurantById);

// Actualizar (ADMIN o GERENTE)
router.put('/:id', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), updateRestaurant);

// Eliminar (ADMIN)
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deleteRestaurant);

export default router;