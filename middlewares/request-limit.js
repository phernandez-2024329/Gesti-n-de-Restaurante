import rateLimit from 'express-rate-limit';

export const requestLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Demasiadas peticiones. Intenta en 15 minutos.',
            error: 'RATE_LIMIT_EXCEEDED',
        });
    },
});

export const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Demasiados intentos de login. Intenta en 15 minutos.',
        error: 'AUTH_RATE_LIMIT_EXCEEDED',
    },
});