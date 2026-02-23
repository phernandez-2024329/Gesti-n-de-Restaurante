import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
    const secret   = process.env.JWT_SECRET;
    const issuer   = process.env.JWT_ISSUER;
    const audience = process.env.JWT_AUDIENCE;

    if (!secret) {
        return res.status(500).json({
            success: false,
            message: 'Falta JWT_SECRET en la configuración del servidor',
        });
    }

    const token =
        req.header('x-token') ||
        req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No se proporcionó un token de acceso',
            error: 'MISSING_TOKEN',
        });
    }

    try {
        const verifyOptions = {};
        if (issuer)   verifyOptions.issuer   = issuer;
        if (audience) verifyOptions.audience = audience;

        const decoded = jwt.verify(token, secret, verifyOptions);

        req.user = {
            id:   decoded.sub,
            jti:  decoded.jti,
            iat:  decoded.iat,
            role: decoded.role || 'CLIENTE',
        };

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'El token ha expirado',
                error: 'TOKEN_EXPIRED',
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token inválido',
            error: 'INVALID_TOKEN',
        });
    }
};