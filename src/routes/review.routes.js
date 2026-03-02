import { Router } from 'express';
import { createReview, getReviews, updateReview, deactivateReview } from '../controllers/review.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

router.post('/', validateJWT, createReview);
router.get('/', getReviews);
router.put('/:id', validateJWT, updateReview);
router.delete('/:id', validateJWT, deactivateReview);

export default router;
