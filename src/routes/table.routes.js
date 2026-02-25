import { Router } from 'express';
import {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable
} from '../controllers/table.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { Roles } from '../constants/roles.js';

const router = Router();

// Crear mesa (ADMIN o GERENTE)
router.post('/', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), createTable);

// Listar mesas (?restaurant_id=...)
router.get('/', validateJWT, getTables);

// Obtener por id
router.get('/:id', validateJWT, getTableById);

// Actualizar (ADMIN o GERENTE)
router.put('/:id', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), updateTable);

// Eliminar (ADMIN)
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deleteTable);

export default router;