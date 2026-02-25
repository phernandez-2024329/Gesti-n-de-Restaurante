import { Router } from 'express';
import eventsController from '../controllers/events.controller.js';

import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} = eventsController;

const router = Router();

router.post('/', validateJWT, validateRole('ADMIN', 'GERENTE'), createEvent);
router.get('/', validateJWT, getEvents);
router.put('/:id', validateJWT, validateRole('ADMIN', 'GERENTE'), updateEvent);
router.delete('/:id', validateJWT, validateRole('ADMIN'), deleteEvent);

export default router;