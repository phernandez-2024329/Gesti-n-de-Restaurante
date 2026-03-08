import { Router } from 'express';
import {
  getDemandaRestaurantes,
  getTopPlatos,
  getIngresos,
  getHorasPico,
  getReservaciones,
  getDesempenoRestaurante,
  getOcupacion,
  getClientesFrecuentes,
  getPedidosRecurrentes
} from '../controllers/report.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateRole } from '../../middlewares/validate-role.js';
import { Roles } from '../constants/roles.js';

const router = Router();

const reportAuth = [validateJWT, validateRole(Roles.ADMIN, Roles.GERENTE)];

router.get('/demanda-restaurantes', reportAuth, getDemandaRestaurantes);
router.get('/top-platos', reportAuth, getTopPlatos);
router.get('/ingresos', reportAuth, getIngresos);
router.get('/horas-pico', reportAuth, getHorasPico);
router.get('/reservaciones', reportAuth, getReservaciones);
router.get('/desempeno-restaurante/:restaurantID', reportAuth, getDesempenoRestaurante);
router.get('/ocupacion/:restaurantID', reportAuth, getOcupacion);
router.get('/clientes-frecuentes/:restaurantID', reportAuth, getClientesFrecuentes);
router.get('/pedidos-recurrentes/:restaurantID', reportAuth, getPedidosRecurrentes);

export default router;
