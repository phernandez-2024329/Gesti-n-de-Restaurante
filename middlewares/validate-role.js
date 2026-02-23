'use strict';

export const validateRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                success: false,
                message: 'Se requiere validar el JWT antes del rol',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`,
                error: 'FORBIDDEN',
            });
        }

        next();
    };
};