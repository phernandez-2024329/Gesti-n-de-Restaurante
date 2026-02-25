<<<<<<< HEAD
import { Router } from "express";
import { auth } from "../middlewares/auth.js";

=======
import { Router } from 'express';
>>>>>>> ft/kevin
import {
    createRestaurante,
    getRestaurantes,
    getRestauranteById,
    updateRestaurante,
    deleteRestaurante
<<<<<<< HEAD
} from "./restaurante.controller.js";

const route = Router();

route.post(
    "/",
    auth,
    createRestaurante
);

route.get(
    "/",
    auth,
    getRestaurantes
);

route.get(
    "/:id",
    auth,
    getRestauranteById
);

route.put(
    "/:id",
    auth,
    updateRestaurante
);

route.delete(
    "/:id",
    auth,
    deleteRestaurante
);

export default route;
=======
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
>>>>>>> ft/kevin
