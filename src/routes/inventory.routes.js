import { Router } from 'express';
import { 
  createInventory, 
  getInventory, 
  getInventoryByRestaurant,
  getInventoryById, 
  updateInventory, 
  deleteInventory,
  decreaseInventory,
  increaseInventory,
  searchInventoryByName
} from '../controllers/inventory.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { Roles } from '../constants/roles.js';

const router = Router();

// Crear artículo de inventario
router.post('/', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), createInventory);

// Obtener inventario general
router.get('/', validateJWT, getInventory);

// Obtener inventario por restaurante
router.get('/restaurant/:restaurantId', getInventoryByRestaurant);

// Buscar artículos por nombre
router.get('/restaurant/:restaurantId/search', searchInventoryByName);

// Obtener artículo por ID
router.get('/:id', validateJWT, getInventoryById);

// Actualizar artículo
router.put('/:id', validateJWT, validateRole(Roles.ADMIN), updateInventory);

// Eliminar artículo
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deleteInventory);

// Descontar del inventario (para órdenes)
router.post('/:id/decrease', validateJWT, decreaseInventory);

// Incrementar inventario
router.post('/:id/increase', validateJWT, validateRole(Roles.ADMIN), increaseInventory);

export default router;
