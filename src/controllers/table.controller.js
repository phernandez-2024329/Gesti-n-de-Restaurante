import Table from '../models/table.model.js';
import Restaurante from '../models/restaurantes.model.js';

export const createTable = async (req, res) => {
  try {
    const {
      table_name,
      table_number,
      table_ubication,
      table_capacity,
      table_time_available,
      table_state,
      restaurant_id,
      reserva_id
    } = req.body;

    const restaurante = await Restaurante.findById(restaurant_id);
    if (!restaurante || !restaurante.estado) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado'
      });
    }

    const table = new Table({
      table_name,
      table_number,
      table_ubication,
      table_capacity,
      table_time_available,
      table_state,
      restaurant_id,
      reserva_id
    });

    await table.save();

    res.status(201).json({
      success: true,
      message: 'Mesa creada',
      table
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear mesa',
      error: error.message
    });
  }
};

export const getTables = async (req, res) => {
  try {
    const { restaurant_id } = req.query;
    const filter = { estado: true };

    if (restaurant_id) filter.restaurant_id = restaurant_id;

    const tables = await Table.find(filter)
      .populate('restaurant_id', 'nombre')
      .populate('reserva_id');

    res.status(200).json({
      success: true,
      total: tables.length,
      tables
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener mesas',
      error: error.message
    });
  }
};

export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id)
      .populate('restaurant_id', 'nombre')
      .populate('reserva_id');

    if (!table || !table.estado) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      table
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener mesa',
      error: error.message
    });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Table.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mesa actualizada',
      table: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar mesa',
      error: error.message
    });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mesa eliminada',
      table
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar mesa',
      error: error.message
    });
  }
};