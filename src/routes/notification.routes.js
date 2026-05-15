import { Router } from 'express';
import { createNotification, getNotifications, updateNotification, deleteNotification } from '../controllers/notification.controller.js';

const router = Router();

router.post('/', createNotification);
router.get('/', getNotifications);
router.put('/:notificationId', updateNotification);
router.delete('/:notificationId', deleteNotification);

export default router;
