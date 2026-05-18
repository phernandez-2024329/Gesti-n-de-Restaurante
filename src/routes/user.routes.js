
import { Router } from 'express';
import { registerUser, loginUser, getProfile, getUsers, updateUser, deleteUser, verifyEmail } from '../controllers/user.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole }       from '../../middlewares/validate-role.js';
import { validateRegister, validateLogin, validateUpdateUser } from '../../middlewares/auth-validators.js';
import { Roles } from '../constants/roles.js';

const router = Router();
// Verificación de email
router.get('/verify-email', verifyEmail);

// Rutas públicas
router.post('/register', validateRegister, registerUser);
router.post('/login',    validateLogin, loginUser);

// Rutas protegidas
router.get('/me',           validateJWT, getProfile);
router.get('/profile',      validateJWT, getProfile);
router.get('/users',        validateJWT, validateRole(Roles.ADMIN), getUsers);
router.put('/users/:id',    validateJWT, validateUpdateUser, updateUser);
router.delete('/users/:id', validateJWT, validateRole(Roles.ADMIN), deleteUser);

export default router;