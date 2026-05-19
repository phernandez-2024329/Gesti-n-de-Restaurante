import jwt from 'jsonwebtoken';

const buildUserFromToken = (token) => {
    const secret   = process.env.JWT_SECRET;
    const issuer   = process.env.JWT_ISSUER;
    const audience = process.env.JWT_AUDIENCE;

    if (!secret) {
        const error = new Error('Falta JWT_SECRET en la configuración del servidor');
        error.statusCode = 500;
        throw error;
    }

    const verifyOptions = {};
    if (issuer)   verifyOptions.issuer   = issuer;
    if (audience) verifyOptions.audience = audience;

    const decoded = jwt.verify(token, secret, verifyOptions);

    return {
        id: decoded.sub,
        jti: decoded.jti,
        iat: decoded.iat,
        role: decoded.role || decoded.rol_id || 'CLIENTE',
        rol_id: decoded.rol_id || decoded.role || 'CLIENTE',
        restaurant_id: decoded.restaurant_id || decoded.restauranteAsignado || null,
    };
};

const extractToken = (req) =>
    req.header('x-token') || req.header('Authorization')?.replace('Bearer ', '');

export const validateJWT = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No se proporcionó un token de acceso',
            error: 'MISSING_TOKEN',
        });
    }

    try {
        req.user = buildUserFromToken(token);
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'El token ha expirado',
                error: 'TOKEN_EXPIRED',
            });
        }
        const statusCode = error.statusCode || 401;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Token inválido',
            error: 'INVALID_TOKEN',
        });
    }
};

export const optionalValidateJWT = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return next();
    }

    try {
        req.user = buildUserFromToken(token);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'El token ha expirado',
                error: 'TOKEN_EXPIRED',
            });
        }

        const statusCode = error.statusCode || 401;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Token inválido',
            error: 'INVALID_TOKEN',
        });
    }
};