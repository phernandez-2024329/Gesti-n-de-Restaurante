import { Router } from "express";
import { validateJWT } from "../../middlewares/validate-JWT.js";

import {
  createMenu,
  getMenus,
  getMenusByRestaurant,
  getMenuById,
  updateMenu,
  deleteMenu,
  searchMenu,
  addDishToMenu,
  removeDishFromMenu,
  addBeverageToMenu,
  removeBeverageFromMenu
} from "../controllers/menu.controller.js";

const route = Router();

route.post("/", validateJWT, createMenu);

route.get("/", validateJWT, getMenus);

route.get("/search", validateJWT, searchMenu);

route.get("/restaurant/:restaurantId", getMenusByRestaurant);

route.get("/:id", validateJWT, getMenuById);

route.put("/:id", validateJWT, updateMenu);

route.delete("/:id", validateJWT, deleteMenu);

// Agregar/remover platillos del menú
route.post("/:menuId/dishes", validateJWT, addDishToMenu);

route.delete("/:menuId/dishes", validateJWT, removeDishFromMenu);

// Agregar/remover bebidas del menú
route.post("/:menuId/beverages", validateJWT, addBeverageToMenu);

route.delete("/:menuId/beverages", validateJWT, removeBeverageFromMenu);

export default route;
