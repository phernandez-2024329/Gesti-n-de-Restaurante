'use strict';

export const validateRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                success: false,
                message: 'Se requiere validar el JWT antes del rol',
            });
        }

        // user may carry role in "role" or "rol_id" depending on how token was generated
        const current = req.user.role || req.user.rol_id;
        if (!allowedRoles.includes(current)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`,
                error: 'FORBIDDEN',
            });
        }

        next();
    };
};