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

const router = Router();

router.get('/demanda-restaurantes', getDemandaRestaurantes);
router.get('/top-platos', getTopPlatos);
router.get('/ingresos', getIngresos);
router.get('/horas-pico', getHorasPico);
router.get('/reservaciones', getReservaciones);
router.get('/desempeno-restaurante/:restaurantID', getDesempenoRestaurante);
router.get('/ocupacion/:restaurantID', getOcupacion);
router.get('/clientes-frecuentes/:restaurantID', getClientesFrecuentes);
router.get('/pedidos-recurrentes/:restaurantID', getPedidosRecurrentes);

export default router;
