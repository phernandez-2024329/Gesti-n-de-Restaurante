import { Router } from "express";
import { auth } from "../../middlewares/auth.js";

import {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  searchMenu
} from "../controllers/menu.controller.js";

const route = Router();

route.post(
  "/",
  auth,
  createMenu
);

route.get(
  "/",
  auth,
  getMenus
);

route.get(
  "/search",
  auth,
  searchMenu
);

route.get(
  "/:id",
  auth,
  getMenuById
);

route.put(
  "/:id",
  auth,
  updateMenu
);

route.delete(
  "/:id",
  auth,
  deleteMenu
);

export default route;
