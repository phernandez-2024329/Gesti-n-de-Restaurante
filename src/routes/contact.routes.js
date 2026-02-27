import { Router } from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
} from '../controllers/contact.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { Roles } from '../constants/roles.js';

const router = Router();

// Crear contacto (ADMIN o GERENTE)
router.post('/', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), createContact);

// Listar contactos
router.get('/', validateJWT, getContacts);

// Obtener por id
router.get('/:id', validateJWT, getContactById);

// Actualizar (ADMIN o GERENTE)
router.put('/:id', validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE), updateContact);

// Eliminar (ADMIN)
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deleteContact);

export default router;