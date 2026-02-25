import Reservation from '../models/reservation.model.js';

export const createReservation = async (req, res) => {
  try {
    const {
      reservation_price,
      reservation_state,
      reservation_surcharge,
      reservation_history,
      user_id
    } = req.body;

    const reservation = new Reservation({
      reservation_price,
      reservation_state,
      reservation_surcharge,
      reservation_history,
      user_id
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      message: 'Reservación creada',
      reservation
    });

  } catch (error) {
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

    const reservations = await Reservation.find(filter)
      .populate('user_id', 'nombre email');

    res.status(200).json({
      success: true,
      total: reservations.length,
      reservations
    });

  } catch (error) {
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

    const reservation = await Reservation.findById(id)
      .populate('user_id', 'nombre email');

    if (!reservation || !reservation.estado) {
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
    res.status(500).json({
      success: false,
      message: 'Error al obtener reservación',
      error: error.message
    });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Reservation.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Reservación no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservación actualizada',
      reservation: updated
    });

  } catch (error) {
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

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservación no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservación eliminada',
      reservation
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar reservación',
      error: error.message
    });
  }
};