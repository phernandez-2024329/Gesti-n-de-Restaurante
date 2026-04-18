import { Router } from 'express';
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
} from '../controllers/reservation.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import {
  validateCreateReservation,
  validateUpdateReservation,
  validateReservationIdParam
} from '../../middlewares/route-validators.js';
import { Roles } from '../constants/roles.js';

const router = Router();

// Crear reservación (ADMIN o GERENTE)
router.post('/', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), ...validateCreateReservation, createReservation);

// Listar reservaciones
router.get('/', validateJWT, getReservations);

// Obtener por id
router.get('/:id', validateJWT, ...validateReservationIdParam, getReservationById);

// Actualizar (ADMIN o GERENTE)
router.put('/:id', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), ...validateUpdateReservation, updateReservation);

// Eliminar (ADMIN)
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), ...validateReservationIdParam, deleteReservation);

export default router;