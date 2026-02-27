import { Router } from "express";
import { auth } from "../middlewares/auth.js";

import {
  createMesa,
  getMesas,
  getMesaById,
  updateMesa,
  deleteMesa,
  searchMesas
} from "../controllers/mesa.controller.js";

const route = Router();

route.post(
  "/",
  auth,
  createMesa
);

route.get(
  "/",
  auth,
  getMesas
);

route.get(
  "/search",
  auth,
  searchMesas
);

route.get(
  "/:id",
  auth,
  getMesaById
);

route.put(
  "/:id",
  auth,
  updateMesa
);

route.delete(
  "/:id",
  auth,
  deleteMesa
);

export default route;
