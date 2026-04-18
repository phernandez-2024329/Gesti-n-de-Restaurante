import { Router } from "express";
import {
    createUsuario,
    getUsuarios,
    getUsuarioById,
    searchUsuario,
    updateUsuario,
    deleteUsuario
} from "../controllers/usuario.controller.js";

const route = Router();

route.post(
    "/:create",
    createUsuario
);

route.get(
    "/",
    getUsuarios
);

route.get(
    "/search",
    searchUsuario
);  

route.get(
    "/:id",
    getUsuarioById
);

route.put(
    "/:id",
    updateUsuario
);

route.delete(
    "/:id",
    deleteUsuario
);

export default route;
