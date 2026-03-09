'use strict';

import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';

export const validateCreateRestaurant = [
    body('restaurant_name')
        .trim()
        .notEmpty().withMessage('El nombre del restaurante es obligatorio')
        .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
    body('restaurant_type')
        .trim()
        .notEmpty().withMessage('El tipo de restaurante es obligatorio'),
    body('restaurant_type_gastronomic')
        .trim()
        .notEmpty().withMessage('El tipo gastronómico es obligatorio'),
    body('restaurant_direction')
        .trim()
        .notEmpty().withMessage('La dirección es obligatoria'),
    body('restaurant_time_start')
        .trim()
        .notEmpty().withMessage('La hora de apertura es obligatoria'),
    body('restaurant_time_close')
        .trim()
        .notEmpty().withMessage('La hora de cierre es obligatoria'),
    body('restaurant_mean_price')
        .notEmpty().withMessage('El precio promedio es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio promedio debe ser un número mayor o igual a 0'),
    body('contact_id')
        .optional()
        .isMongoId().withMessage('contact_id inválido'),
    body('table_id')
        .optional()
        .isMongoId().withMessage('table_id inválido'),
    checkValidators
];

export const validateUpdateRestaurant = [
    param('id').isMongoId().withMessage('ID de restaurante inválido'),
    body('restaurant_name').optional().trim().isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
    body('restaurant_mean_price').optional().isFloat({ min: 0 }).withMessage('Precio debe ser >= 0'),
    checkValidators
];

export const validateCreateReservation = [
    body('restaurant_id').notEmpty().withMessage('restaurant_id es obligatorio').isMongoId().withMessage('restaurant_id inválido'),
    body('reservation_type').isIn(['mesa', 'domicilio', 'para_llevar']).withMessage('reservation_type debe ser mesa, domicilio o para_llevar'),
    body('reservation_date').notEmpty().withMessage('reservation_date es obligatoria').isISO8601().withMessage('reservation_date debe ser fecha válida'),
    body('reservation_time').trim().notEmpty().withMessage('reservation_time es obligatoria'),
    body('reservation_price').notEmpty().withMessage('reservation_price es obligatorio').isFloat({ min: 0 }).withMessage('reservation_price debe ser >= 0'),
    body('user_id').notEmpty().withMessage('user_id es obligatorio').isMongoId().withMessage('user_id inválido'),
    body('table_id').optional().isMongoId().withMessage('table_id inválido'),
    body('reservation_surcharge').optional().isFloat({ min: 0 }).withMessage('reservation_surcharge debe ser >= 0'),
    checkValidators
];

export const validateCreateTable = [
    body('table_name').trim().notEmpty().withMessage('El nombre de la mesa es obligatorio'),
    body('table_number')
        .notEmpty().withMessage('El número de mesa es obligatorio')
        .isInt({ min: 1 }).withMessage('table_number debe ser entero positivo')
        .toInt(),
    body('table_ubication').trim().notEmpty().withMessage('La ubicación es obligatoria'),
    body('table_capacity')
        .notEmpty().withMessage('La capacidad es obligatoria')
        .isInt({ min: 1 }).withMessage('table_capacity debe ser al menos 1')
        .toInt(),
    body('restaurant_id').notEmpty().withMessage('restaurant_id es obligatorio').isMongoId().withMessage('restaurant_id inválido'),
    body('table_state').optional().isIn(['Disponible', 'Ocupada', 'Reservada']).withMessage('table_state inválido'),
    checkValidators
];

export const validateCreateOrder = [
    body('Orders_domicile').trim().notEmpty().withMessage('La dirección de domicilio es obligatoria'),
    body('Orders_number').trim().notEmpty().withMessage('El número de orden es obligatorio'),
    body('Orders_facture').trim().notEmpty().withMessage('La factura es obligatoria'),
    body('Orders_facture_descripcion').trim().notEmpty().withMessage('La descripción de la factura es obligatoria'),
    body('Restaurant_id').notEmpty().withMessage('Restaurant_id es obligatorio').isMongoId().withMessage('Restaurant_id inválido'),
    body('Menu_id').notEmpty().withMessage('Menu_id es obligatorio').isMongoId().withMessage('Menu_id inválido'),
    body('User_id').optional().isMongoId().withMessage('User_id inválido'),
    checkValidators
];
