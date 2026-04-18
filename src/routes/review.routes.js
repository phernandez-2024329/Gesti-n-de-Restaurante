import { Router } from 'express';
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deactivateReview
} from '../controllers/review.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  validateCreateReview,
  validateUpdateReview,
  validateReviewIdParam
} from '../../middlewares/route-validators.js';

const router = Router();

router.post('/', validateJWT, ...validateCreateReview, createReview);
router.get('/', getReviews);
router.get('/:id', ...validateReviewIdParam, getReviewById);
router.put('/:id', validateJWT, ...validateUpdateReview, updateReview);
router.delete('/:id', validateJWT, ...validateReviewIdParam, deactivateReview);

export default router;
