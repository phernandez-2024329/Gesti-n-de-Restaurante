'use strict';

import { body } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { AllowedRoles } from '../src/constants/roles.js';

export const validateRegister = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),

    body('username')
        .trim()
        .notEmpty().withMessage('El username es obligatorio')
        .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Solo letras, números y guiones bajos'),

    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
        .matches(/[A-Z]/).withMessage('Debe tener al menos una mayúscula')
        .matches(/[0-9]/).withMessage('Debe tener al menos un número'),

    body('telefono')
        .trim()
        .notEmpty().withMessage('El teléfono es obligatorio')
        .matches(/^\d{8}$/).withMessage('El teléfono debe tener 8 dígitos'),

    body('rol')
        .optional()
        .isIn(AllowedRoles)
        .withMessage('Rol inválido'),

    body('rol_id')
        .optional()
        .isIn(AllowedRoles)
        .withMessage('Rol_id inválido'),

    checkValidators
];

export const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),

    checkValidators
];

export const validateUpdateUser = [
    body('nombre')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),

    body('telefono')
        .optional()
        .matches(/^\d{8}$/).withMessage('El teléfono debe tener 8 dígitos'),

    body('email')
        .optional()
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    checkValidators
];