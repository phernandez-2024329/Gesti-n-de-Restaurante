import { Router } from 'express';
import { getRoles } from '../controllers/role.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { Roles } from '../constants/roles.js';

const router = Router();

// cualquier usuario autenticado puede consultar la lista de roles
router.get('/', validateJWT, getRoles);

// si en el futuro se agregan operaciones de creación/eliminación, se protegerán con validateRole(Roles.ADMIN)
export default router;
