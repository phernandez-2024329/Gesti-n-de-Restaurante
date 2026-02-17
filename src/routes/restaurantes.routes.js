import { Router } from "express";
import { auth } from "../middlewares/auth.js";

import {
    createRestaurante,
    getRestaurantes,
    getRestauranteById,
    updateRestaurante,
    deleteRestaurante
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
