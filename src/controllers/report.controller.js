import Orders from '../models/orders.model.js';
import DetallePedido from '../models/DetallePedido.model.js';
import Reservation from '../models/reservation.model.js';
import Invoice from '../models/invoice.model.js';
import Review from '../models/review.model.js';
import Table from '../models/table.model.js';
import Restaurant from '../models/restaurant.model.js';
import Usuario from '../models/user.model.js';
import Dish from '../models/dish.model.js';
import Beverage from '../models/beverage.model.js';

const DEFAULT_RANGE_DAYS = 30;

const toDateOrThrow = (value, label) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const error = new Error(`Fecha inválida en ${label}`);
    error.statusCode = 400;
    throw error;
  }

  return date;
};

const buildRange = (query, field, defaultDays = DEFAULT_RANGE_DAYS) => {
  let start = toDateOrThrow(query.from, 'from');
  let end = toDateOrThrow(query.to, 'to');

  if (!start && !end) {
    end = new Date();
    start = new Date(end);
    start.setDate(start.getDate() - defaultDays);
  }

  if (start && end && start > end) {
    const error = new Error('El rango de fechas es inválido');
    error.statusCode = 400;
    throw error;
  }

  const range = {};
  if (start) range.$gte = start;
  if (end) range.$lte = end;

  return Object.keys(range).length > 0 ? { [field]: range } : {};
};

const sendError = (res, error, message) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message,
    error: error.message
  });
};

const round = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const restaurantNamesById = async (ids) => {
  const uniqueIds = [...new Set(ids.filter(Boolean).map((id) => String(id)))];
  if (uniqueIds.length === 0) return new Map();

  const restaurants = await Restaurant.find({ _id: { $in: uniqueIds } })
    .select('restaurant_name')
    .lean();

  return new Map(restaurants.map((restaurant) => [String(restaurant._id), restaurant.restaurant_name]));
};

const userNamesById = async (ids) => {
  const uniqueIds = [...new Set(ids.filter(Boolean).map((id) => String(id)))];
  if (uniqueIds.length === 0) return new Map();

  const users = await Usuario.find({ _id: { $in: uniqueIds } })
    .select('nombre username')
    .lean();

  return new Map(
    users.map((user) => [
      String(user._id),
      user.nombre || user.username || String(user._id)
    ])
  );
};

const productNamesById = async (items) => {
  const dishIds = [...new Set(items.filter((item) => item.productType === 'dish').map((item) => String(item.productId)))];
  const beverageIds = [...new Set(items.filter((item) => item.productType === 'beverage').map((item) => String(item.productId)))];

  const [dishes, beverages] = await Promise.all([
    dishIds.length > 0 ? Dish.find({ _id: { $in: dishIds } }).select('name').lean() : [],
    beverageIds.length > 0 ? Beverage.find({ _id: { $in: beverageIds } }).select('name').lean() : []
  ]);

  const map = new Map();
  for (const dish of dishes) map.set(String(dish._id), dish.name);
  for (const beverage of beverages) map.set(String(beverage._id), beverage.name);
  return map;
};

const aggregateOrdersByRestaurant = async (rangeMatch = {}) => {
  const rows = await Orders.aggregate([
    { $match: { estado: true, ...rangeMatch } },
    {
      $group: {
        _id: '$Restaurant_id',
        pedidos: { $sum: 1 }
      }
    },
    { $sort: { pedidos: -1 } }
  ]);

  const names = await restaurantNamesById(rows.map((row) => row._id));

  return rows.map((row) => ({
    restaurantId: row._id,
    restaurantName: names.get(String(row._id)) || 'Restaurante sin nombre',
    pedidos: row.pedidos
  }));
};

const aggregateOrdersByDay = async (restaurantID = null, rangeMatch = {}) => {
  const match = { estado: true, ...rangeMatch };
  if (restaurantID) match.Restaurant_id = restaurantID;

  return Orders.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        pedidos: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        fecha: '$_id',
        pedidos: 1
      }
    }
  ]);
};

const aggregateTopProducts = async (restaurantID = null, rangeMatch = {}, limit = 10) => {
  const match = { estado: true, ...rangeMatch };
  if (restaurantID) match.restaurant_id = restaurantID;

  const rows = await DetallePedido.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          productId: '$producto',
          productType: '$productType'
        },
        totalQuantity: { $sum: '$candidadproducto' },
        totalOrders: { $sum: 1 }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit }
  ]);

  const productMap = await productNamesById(
    rows.map((row) => ({
      productId: row._id.productId,
      productType: row._id.productType
    }))
  );

  return rows.map((row) => ({
    productId: row._id.productId,
    productType: row._id.productType,
    productName: productMap.get(String(row._id.productId)) || 'Producto sin nombre',
    totalQuantity: row.totalQuantity,
    totalOrders: row.totalOrders
  }));
};

const aggregateInvoicesByRestaurant = async (rangeMatch = {}) => {
  const rows = await Invoice.aggregate([
    { $match: { estado: true, status: 'pagada', ...rangeMatch } },
    {
      $group: {
        _id: '$restaurant_id',
        totalIncome: { $sum: '$total' },
        invoices: { $sum: 1 }
      }
    },
    { $sort: { totalIncome: -1 } }
  ]);

  const names = await restaurantNamesById(rows.map((row) => row._id));

  return rows.map((row) => ({
    restaurantId: row._id,
    restaurantName: names.get(String(row._id)) || 'Restaurante sin nombre',
    totalIncome: round(row.totalIncome),
    invoices: row.invoices
  }));
};

const aggregateReservationsByDay = async (restaurantID = null, rangeMatch = {}) => {
  const match = { estado: true, ...rangeMatch };
  if (restaurantID) match.restaurant_id = restaurantID;

  return Reservation.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$reservation_date' }
        },
        total: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        fecha: '$_id',
        total: 1
      }
    }
  ]);
};

export const getDemandaRestaurantes = async (req, res) => {
  try {
    const rangeMatch = buildRange(req.query, 'createdAt');
    const data = await aggregateOrdersByRestaurant(rangeMatch);

    res.json({
      success: true,
      message: 'Demanda de restaurantes calculada desde órdenes reales',
      data
    });
  } catch (error) {
    sendError(res, error, 'Error al generar el reporte de demanda');
  }
};

export const getTopPlatos = async (req, res) => {
  try {
    const rangeMatch = buildRange(req.query, 'createdAt');
    const data = await aggregateTopProducts(null, rangeMatch, 10);

    res.json({
      success: true,
      message: 'Top de productos calculado desde detalles de pedido reales',
      data
    });
  } catch (error) {
    sendError(res, error, 'Error al generar el reporte de top platos');
  }
};

export const getIngresos = async (req, res) => {
  try {
    const rangeMatch = buildRange(req.query, 'createdAt');
    const data = await aggregateInvoicesByRestaurant(rangeMatch);
    const total = round(data.reduce((sum, item) => sum + item.totalIncome, 0));

    res.json({
      success: true,
      message: 'Ingresos calculados desde facturas pagadas reales',
      data: {
        total,
        byRestaurant: data
      }
    });
  } catch (error) {
    sendError(res, error, 'Error al generar el reporte de ingresos');
  }
};

export const getHorasPico = async (req, res) => {
  try {
    const rangeMatch = buildRange(req.query, 'createdAt');
    const data = await Orders.aggregate([
      { $match: { estado: true, ...rangeMatch } },
      {
        $group: {
          _id: { $dateToString: { format: '%H:00', date: '$createdAt' } },
          pedidos: { $sum: 1 }
        }
      },
      { $sort: { pedidos: -1, _id: 1 } },
      {
        $project: {
          _id: 0,
          hora: '$_id',
          pedidos: 1
        }
      }
    ]);

    res.json({
      success: true,
      message: 'Horas pico calculadas desde órdenes reales',
      data
    });
  } catch (error) {
    sendError(res, error, 'Error al generar el reporte de horas pico');
  }
};

export const getReservaciones = async (req, res) => {
  try {
    const rangeMatch = buildRange(req.query, 'reservation_date');
    const data = await aggregateReservationsByDay(null, rangeMatch);

    res.json({
      success: true,
      message: 'Reservaciones calculadas desde reservaciones reales',
      data
    });
  } catch (error) {
    sendError(res, error, 'Error al generar el reporte de reservaciones');
  }
};

export const getDesempenoRestaurante = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    const rangeMatch = buildRange(req.query, 'createdAt');
    const reservationRange = buildRange(req.query, 'reservation_date');

    const [restaurant, totalOrders, incomeRows, reservationCount, ratingAgg, ordersByDay, activeTables] = await Promise.all([
      Restaurant.findById(restaurantID).select('restaurant_name').lean(),
      Orders.countDocuments({ estado: true, Restaurant_id: restaurantID, ...rangeMatch }),
      Invoice.aggregate([
        { $match: { estado: true, status: 'pagada', restaurant_id: restaurantID, ...rangeMatch } },
        {
          $group: {
            _id: '$restaurant_id',
            totalIncome: { $sum: '$total' }
          }
        }
      ]),
      Reservation.countDocuments({ estado: true, restaurant_id: restaurantID, ...reservationRange }),
      Review.aggregate([
        { $match: { active: true, restaurant_id: restaurantID } },
        {
          $group: {
            _id: '$restaurant_id',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]),
      aggregateOrdersByDay(restaurantID, rangeMatch),
      Table.countDocuments({ estado: true, restaurant_id: restaurantID })
    ]);

    const totalIncome = round(incomeRows[0]?.totalIncome || 0);
    const averageRating = round(ratingAgg[0]?.averageRating || 0);
    const totalReviews = ratingAgg[0]?.totalReviews || 0;

    const start = toDateOrThrow(req.query.from, 'from') || new Date(Date.now() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000);
    const end = toDateOrThrow(req.query.to, 'to') || new Date();
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    const averageOccupancy = activeTables > 0 ? round((reservationCount / (activeTables * days)) * 100) : 0;

    res.json({
      success: true,
      message: 'Desempeño del restaurante calculado desde datos reales',
      data: {
        restaurantId: restaurantID,
        restaurantName: restaurant?.restaurant_name || 'Restaurante sin nombre',
        totalOrders,
        totalIncome,
        reservationCount,
        averageRating,
        totalReviews,
        activeTables,
        averageOccupancy,
        ordersByDay
      }
    });
  } catch (error) {
    sendError(res, error, 'Error al generar el reporte de desempeño');
  }
};

export const getOcupacion = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    const reservationRange = buildRange(req.query, 'reservation_date');
    const [activeTables, reservationCount] = await Promise.all([
      Table.countDocuments({ estado: true, restaurant_id: restaurantID }),
      Reservation.countDocuments({ estado: true, restaurant_id: restaurantID, ...reservationRange })
    ]);

    const start = toDateOrThrow(req.query.from, 'from') || new Date(Date.now() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000);
    const end = toDateOrThrow(req.query.to, 'to') || new Date();
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    const ocupacion = activeTables > 0 ? round((reservationCount / (activeTables * days)) * 100) : 0;

    res.json({
      success: true,
      message: 'Ocupación calculada desde reservas y mesas reales',
      data: {
        restaurantId: restaurantID,
        activeTables,
        reservationCount,
        ocupacion
      }
    });
  } catch (error) {
    sendError(res, error, 'Error al generar el reporte de ocupación');
  }
};

export const getClientesFrecuentes = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    const rangeMatch = buildRange(req.query, 'createdAt');
    const rows = await Orders.aggregate([
      { $match: { estado: true, Restaurant_id: restaurantID, ...rangeMatch } },
      {
        $group: {
          _id: '$User_id',
          visitas: { $sum: 1 }
        }
      },
      { $sort: { visitas: -1 } },
      { $limit: 10 }
    ]);

    const names = await userNamesById(rows.map((row) => row._id));

    const data = rows.map((row) => ({
      userId: row._id,
      nombre: names.get(String(row._id)) || 'Cliente sin nombre',
      visitas: row.visitas
    }));

    res.json({
      success: true,
      message: 'Clientes frecuentes calculados desde órdenes reales',
      restaurantID,
      data
    });
  } catch (error) {
    sendError(res, error, 'Error al generar el reporte de clientes frecuentes');
  }
};

export const getPedidosRecurrentes = async (req, res) => {
  try {
    const { restaurantID } = req.params;
    const rangeMatch = buildRange(req.query, 'createdAt');
    const data = await aggregateTopProducts(restaurantID, rangeMatch, 10);

    res.json({
      success: true,
      message: 'Pedidos recurrentes calculados desde detalles de pedido reales',
      restaurantID,
      data
    });
  } catch (error) {
    sendError(res, error, 'Error al generar el reporte de pedidos recurrentes');
  }
};
