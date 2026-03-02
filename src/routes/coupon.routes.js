import { Router } from 'express';
import { createCoupon, getCoupons, updateCoupon, deactivateCoupon } from '../controllers/coupon.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { Roles } from '../constants/roles.js';

const router = Router();

router.post('/', validateJWT, validateRole(Roles.ADMIN), createCoupon);
router.get('/', validateJWT, getCoupons);
router.put('/:id', validateJWT, validateRole(Roles.ADMIN), updateCoupon);
router.delete('/:id', validateJWT, validateRole(Roles.ADMIN), deactivateCoupon);

export default router;
