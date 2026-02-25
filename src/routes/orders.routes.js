import { Router } from "express";
import { auth } from "../middlewares/auth.js";

import {
	createOrder,
	getOrders,
	getOrderById,
	updateOrders,
	deleteOrders,
	searchOrders
} from "../controllers/orders.controller.js";

const route = Router();

route.post(
	"/",
	auth,
	createOrder
);

route.get(
	"/",
	auth,
	getOrders
);

route.get(
	"/search",
	auth,
	searchOrders
);

route.get(
	"/:id",
	auth,
	getOrderById
);

route.put(
	"/:id",
	auth,
	updateOrders
);

route.delete(
	"/:id",
	auth,
	deleteOrders
);

export default route;

