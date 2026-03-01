import { Router } from 'express';
import eventsController from '../controllers/events.controller.js';

import { auth } from '../../middlewares/auth.js';
import { validateRole } from '../../middlewares/validate-role.js';

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} = eventsController;

const router = Router();

router.post('/', auth, validateRole('ADMIN', 'GERENTE'), createEvent);
router.get('/', auth, getEvents);
router.put('/:id', auth, validateRole('ADMIN', 'GERENTE'), updateEvent);
router.delete('/:id', auth, validateRole('ADMIN'), deleteEvent);

export default router;