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
    body('table_id')
        .optional()
        .isMongoId().withMessage('table_id inválido')
        .custom((value, { req }) => {
            if (req.body.reservation_type === 'mesa' && !value) {
                throw new Error('Para reservación tipo mesa se requiere table_id');
            }
            return true;
        }),
    body('reservation_surcharge').optional().isFloat({ min: 0 }).withMessage('reservation_surcharge debe ser >= 0'),
    checkValidators
];

export const validateUpdateReservation = [
    param('id').isMongoId().withMessage('ID de reservación inválido'),
    body('restaurant_id').optional().isMongoId().withMessage('restaurant_id inválido'),
    body('table_id').optional({ values: 'null' }).isMongoId().withMessage('table_id inválido'),
    body('reservation_type').optional().isIn(['mesa', 'domicilio', 'para_llevar']).withMessage('reservation_type debe ser mesa, domicilio o para_llevar'),
    body('reservation_date').optional().isISO8601().withMessage('reservation_date debe ser fecha válida'),
    body('reservation_time').optional().trim().notEmpty().withMessage('reservation_time no puede estar vacía'),
    body('reservation_price').optional().isFloat({ min: 0 }).withMessage('reservation_price debe ser >= 0'),
    body('reservation_state').optional().isIn(['pendiente', 'confirmada', 'cancelada', 'completada']).withMessage('reservation_state inválido'),
    body('reservation_surcharge').optional().isFloat({ min: 0 }).withMessage('reservation_surcharge debe ser >= 0'),
    body('reservation_history').optional().trim(),
    checkValidators
];

export const validateReservationIdParam = [
    param('id').isMongoId().withMessage('ID de reservación inválido'),
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
    body('floor_plan').optional().isObject().withMessage('floor_plan debe ser un objeto'),
    body('floor_plan.x').optional().isFloat({ min: 0 }).withMessage('floor_plan.x debe ser >= 0').toFloat(),
    body('floor_plan.y').optional().isFloat({ min: 0 }).withMessage('floor_plan.y debe ser >= 0').toFloat(),
    body('floor_plan.width').optional({ values: 'null' }).isFloat({ gt: 0 }).withMessage('floor_plan.width debe ser > 0').toFloat(),
    body('floor_plan.height').optional({ values: 'null' }).isFloat({ gt: 0 }).withMessage('floor_plan.height debe ser > 0').toFloat(),
    checkValidators
];

export const validateSaveRestaurantLayout = [
    param('restaurantId').isMongoId().withMessage('restaurantId inválido'),
    body('layouts').isArray({ min: 1 }).withMessage('layouts debe ser un arreglo con al menos un elemento'),
    body('layouts.*.table_id').isMongoId().withMessage('table_id inválido'),
    body('layouts.*.x').isFloat({ min: 0 }).withMessage('x debe ser >= 0').toFloat(),
    body('layouts.*.y').isFloat({ min: 0 }).withMessage('y debe ser >= 0').toFloat(),
    body('layouts.*.width').optional({ values: 'null' }).isFloat({ gt: 0 }).withMessage('width debe ser > 0').toFloat(),
    body('layouts.*.height').optional({ values: 'null' }).isFloat({ gt: 0 }).withMessage('height debe ser > 0').toFloat(),
    checkValidators
];

export const validateCreateOrder = [
    body('Orders_domicile').trim().notEmpty().withMessage('La dirección de domicilio es obligatoria'),
    body('Restaurant_id').notEmpty().withMessage('Restaurant_id es obligatorio').isMongoId().withMessage('Restaurant_id inválido'),
    body('Menu_id').notEmpty().withMessage('Menu_id es obligatorio').isMongoId().withMessage('Menu_id inválido'),
    body('User_id').optional().isMongoId().withMessage('User_id inválido'),
    body('Orders_cupon').optional({ checkFalsy: true }).isIn(['Cupon_30_Quetzales', 'Cupon_20%_Descuento', 'Dos_Por_Uno', 'Envio_Gratis', 'Primera_Compra', 'Descuento_10%', 'Cupon_50_Quetzales', 'Cupon_15%_Descuento']).withMessage('Orders_cupon inválido'),
    checkValidators
];

// --- Detalle de pedido ---
export const validateCreateDetallePedido = [
    body('orders_id').notEmpty().withMessage('orders_id es obligatorio').isMongoId().withMessage('orders_id inválido'),
    body('items').optional().isArray({ min: 1 }).withMessage('items debe ser un arreglo con al menos un producto'),
    body('items.*.producto').optional().isMongoId().withMessage('items[].producto inválido'),
    body('items.*.productType').optional().isIn(['dish', 'beverage']).withMessage('items[].productType debe ser "dish" o "beverage"'),
    body('items.*.candidadproducto').optional().isInt({ min: 1 }).withMessage('items[].candidadproducto debe ser entero >= 1').toInt(),
    body('producto').optional().isMongoId().withMessage('producto inválido'),
    body('productType').optional().isIn(['dish', 'beverage']).withMessage('productType debe ser "dish" o "beverage"'),
    body('candidadproducto').optional().isInt({ min: 1 }).withMessage('candidadproducto debe ser entero >= 1').toInt(),
    checkValidators
];

export const validateUpdateDetallePedido = [
    param('id').isMongoId().withMessage('ID de detalle inválido'),
    body('orders_id').optional().isMongoId().withMessage('orders_id inválido'),
    body('producto').optional().isMongoId().withMessage('producto inválido'),
    body('productType').optional().isIn(['dish', 'beverage']).withMessage('productType debe ser "dish" o "beverage"'),
    body('candidadproducto').optional().isInt({ min: 1 }).toInt(),
    checkValidators
];

export const validateDetallePedidoIdParam = [
    param('id').isMongoId().withMessage('ID de detalle inválido'),
    checkValidators
];

// --- Reseñas (Reviews) ---
export const validateCreateReview = [
    body('user_id').notEmpty().withMessage('user_id es obligatorio').isMongoId().withMessage('user_id inválido'),
    body('restaurant_id').notEmpty().withMessage('restaurant_id es obligatorio').isMongoId().withMessage('restaurant_id inválido'),
    body('rating')
        .notEmpty().withMessage('rating es obligatorio')
        .isInt({ min: 1, max: 5 }).withMessage('rating debe ser entre 1 y 5')
        .toInt(),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('comment máximo 500 caracteres'),
    checkValidators
];

export const validateUpdateReview = [
    param('id').isMongoId().withMessage('ID de reseña inválido'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('rating debe ser entre 1 y 5').toInt(),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('comment máximo 500 caracteres'),
    checkValidators
];

export const validateReviewIdParam = [
    param('id').isMongoId().withMessage('ID de reseña inválido'),
    checkValidators
];
