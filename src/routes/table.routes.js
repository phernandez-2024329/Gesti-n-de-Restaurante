import { Router } from 'express';
import {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
  getRestaurantLayout,
  saveRestaurantLayout
} from '../controllers/table.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { validateCreateTable, validateSaveRestaurantLayout } from '../../middlewares/route-validators.js';
import { Roles } from '../constants/roles.js';

const router = Router();

// Crear mesa (ADMIN o GERENTE)
router.post('/', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), ...validateCreateTable, createTable);

// Listar mesas (?restaurant_id=...)
router.get('/', validateJWT, getTables);

// Obtener layout de mesas por restaurante
router.get('/layout/:restaurantId', validateJWT, getRestaurantLayout);

// Guardar layout completo de mesas por restaurante
router.put(
  '/layout/:restaurantId',
  validateJWT,
  validateRole(Roles.ADMIN, Roles.GERENTE),
  ...validateSaveRestaurantLayout,
  saveRestaurantLayout
);

// Obtener por id
router.get('/:id', validateJWT, getTableById);

// Actualizar (ADMIN o GERENTE)
router.put('/:id', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), updateTable);

// Eliminar (ADMIN)
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deleteTable);

export default router;