import { validateJWT } from '../../middlewares/validate-JWT.js';

export const auth = validateJWT;

export default auth;
