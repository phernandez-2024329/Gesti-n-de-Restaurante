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
import { validateCreateReservation } from '../../middlewares/route-validators.js';
import { Roles } from '../constants/roles.js';

const router = Router();

// Crear reservación (ADMIN o GERENTE)
router.post('/', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), ...validateCreateReservation, createReservation);

// Listar reservaciones
router.get('/', validateJWT, getReservations);

// Obtener por id
router.get('/:id', validateJWT, getReservationById);

// Actualizar (ADMIN o GERENTE)
router.put('/:id', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), updateReservation);

// Eliminar (ADMIN)
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deleteReservation);

export default router;