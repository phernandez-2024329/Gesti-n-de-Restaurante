import { Router } from 'express';
import {
    createRestaurante,
    getRestaurantes,
    getRestauranteById,
    updateRestaurante,
    deleteRestaurante
} from '../controllers/restaurantes.controllers.js';

import { validateJWT }  from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { Roles } from '../constants/roles.js';

const router = Router();

router.post('/',    validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), createRestaurante);

router.get('/',     validateJWT, getRestaurantes);

router.get('/:id',  validateJWT, getRestauranteById);

router.put('/:id',  validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), updateRestaurante);

router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deleteRestaurante);

export default router;