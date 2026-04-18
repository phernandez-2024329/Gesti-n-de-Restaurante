import { Router } from 'express';
import { createInventory, getInventory, getInventoryById, updateInventory, deleteInventory } from '../controllers/inventory.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { Roles } from '../constants/roles.js';

const router = Router();

router.post('/', validateJWT, validateRole(Roles.ADMIN), createInventory);
router.get('/', validateJWT, getInventory);

router.get('/:id', validateJWT, getInventoryById);
router.put('/:id', validateJWT, validateRole(Roles.ADMIN), updateInventory);
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deleteInventory);

export default router;
