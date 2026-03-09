import Reservation from '../models/reservation.model.js';

export const createReservation = async (req, res) => {
  try {
    const {
      restaurant_id,
      table_id,
      reservation_type,
      reservation_date,
      reservation_time,
      reservation_price,
      reservation_surcharge,
      reservation_history,
      user_id
    } = req.body;

    if (!restaurant_id || !reservation_type || !reservation_date || !reservation_time || !reservation_price || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: restaurant_id, reservation_type, reservation_date, reservation_time, reservation_price, user_id'
      });
    }

    if (reservation_type === 'mesa' && !table_id) {
      return res.status(400).json({
        success: false,
        message: 'Para reservación en mesa se requiere table_id'
      });
    }

    const reservationDate = new Date(reservation_date);
    if (isNaN(reservationDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'reservation_date inválida'
      });
    }

    const dayStart = new Date(reservationDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(reservationDate);
    dayEnd.setHours(23, 59, 59, 999);

    if (reservation_type === 'mesa' && table_id) {
      const duplicateTable = await Reservation.findOne({
        estado: true,
        reservation_state: { $nin: ['cancelada'] },
        table_id,
        restaurant_id,
        reservation_date: { $gte: dayStart, $lte: dayEnd },
        reservation_time
      });
      if (duplicateTable) {
        return res.status(400).json({
          success: false,
          message: 'La mesa ya está reservada para esa fecha y hora (evitar reservas duplicadas)'
        });
      }
    }

    const duplicateUser = await Reservation.findOne({
      estado: true,
      reservation_state: { $nin: ['cancelada'] },
      user_id,
      restaurant_id,
      reservation_date: { $gte: dayStart, $lte: dayEnd },
      reservation_time
    });
    if (duplicateUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una reservación en este restaurante para la misma fecha y hora'
      });
    }

    const reservation = new Reservation({
      restaurant_id,
      table_id: reservation_type === 'mesa' ? table_id : null,
      reservation_type,
      reservation_date: new Date(reservation_date),
      reservation_time,
      reservation_price,
      reservation_state: 'pendiente',
      reservation_surcharge: reservation_surcharge ?? 0,
      reservation_history: reservation_history ?? '',
      user_id
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      message: 'Reservación creada',
      reservation
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de reservación no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear reservación',
      error: error.message
    });
  }
};

export const getReservations = async (req, res) => {
  try {
    const filter = { estado: true };
    const { restaurant_id, user_id } = req.query;

    if (restaurant_id) filter.restaurant_id = restaurant_id;
    if (user_id) filter.user_id = user_id;

    const reservations = await Reservation.find(filter)
      .populate('user_id', 'nombre email')
      .populate('restaurant_id', 'restaurant_name restaurant_direction')
      .populate('table_id', 'table_name table_number table_capacity')
      .sort({ reservation_date: 1, reservation_time: 1 });

    res.status(200).json({
      success: true,
      total: reservations.length,
      reservations
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Parámetro de búsqueda inválido (restaurant_id o user_id)',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener reservaciones',
      error: error.message
    });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findOne({ _id: id, estado: true })
      .populate('user_id', 'nombre email')
      .populate('restaurant_id', 'restaurant_name restaurant_direction')
      .populate('table_id', 'table_name table_number table_capacity');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservación no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      reservation
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de reservación no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener reservación',
      error: error.message
    });
  }
};

// Campos permitidos para actualizar (no se permite _id, estado, timestamps)
const RESERVATION_UPDATE_FIELDS = [
  'restaurant_id', 'table_id', 'reservation_type', 'reservation_date', 'reservation_time',
  'reservation_price', 'reservation_state', 'reservation_surcharge', 'reservation_history', 'user_id'
];

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const body = { ...req.body };
    const updateData = {};
    for (const key of RESERVATION_UPDATE_FIELDS) {
      if (body[key] !== undefined) {
        if (key === 'reservation_date' && typeof body[key] === 'string') {
          const d = new Date(body[key]);
          if (!isNaN(d.getTime())) updateData[key] = d;
          else updateData[key] = body[key];
        } else {
          updateData[key] = body[key];
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se enviaron campos válidos para actualizar'
      });
    }

    const updated = await Reservation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updated || !updated.estado) {
      return res.status(404).json({
        success: false,
        message: 'Reservación no encontrada'
      });
    }

    const reservation = await Reservation.findById(updated._id)
      .populate('user_id', 'nombre email')
      .populate('restaurant_id', 'restaurant_name restaurant_direction')
      .populate('table_id', 'table_name table_number table_capacity');

    res.status(200).json({
      success: true,
      message: 'Reservación actualizada',
      reservation
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de reservación no válido',
        error: 'INVALID_ID'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar reservación',
      error: error.message
    });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Reservation.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Reservación no encontrada'
      });
    }
    if (!existing.estado) {
      return res.status(404).json({
        success: false,
        message: 'Reservación ya fue eliminada'
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Reservación eliminada',
      reservation
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de reservación no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar reservación',
      error: error.message
    });
  }
};