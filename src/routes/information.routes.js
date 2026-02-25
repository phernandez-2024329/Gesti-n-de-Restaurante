import { Router } from 'express';
import {
    createInformation,
    getInformations,
    getInformationById,
    updateInformation,
    deleteInformation
} from '../controllers/information.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { validateRegister } from '../../middlewares/auth-validators.js';
import { Roles } from '../constants/roles.js';

const router = Router();

// Crear information (ADMIN o GERENTE)
router.post('/', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), createInformation);

// Listar informations (opcional ?restaurantId=...)
router.get('/', validateJWT, getInformations);

// Obtener por id
router.get('/:id', validateJWT, getInformationById);

// Actualizar (ADMIN o GERENTE)
router.put('/:id', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), updateInformation);

// Eliminar (ADMIN)
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deleteInformation);

export default router;
