import Table from '../models/table.model.js';
import Restaurant from '../models/restaurant.model.js';

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
      reserva_id,
      floor_plan
    } = req.body;

    const restaurante = await Restaurant.findById(restaurant_id);
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
      reserva_id,
      floor_plan
    });

    await table.save();

    const tableObj = table.toObject();
    tableObj.disponibilidad = table.table_state === 'Disponible' ? '✅ Libre' : `❌ ${table.table_state}`;

    res.status(201).json({
      success: true,
      message: 'Mesa creada',
      table: tableObj
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de restaurante o datos inválidos',
        error: 'INVALID_ID'
      });
    }
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
      .populate('restaurant_id', 'restaurant_name restaurant_direction')
      .populate('reserva_id');

    // Agregar información legible de disponibilidad
    const tablesConDisponibilidad = tables.map(table => {
      const tableObj = table.toObject();
      tableObj.disponibilidad = table.table_state === 'Disponible' ? ' Libre' : `No Libre ${table.table_state}`;
      return tableObj;
    });

    res.status(200).json({
      success: true,
      total: tables.length,
      tables: tablesConDisponibilidad
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
      .populate('restaurant_id', 'restaurant_name restaurant_direction')
      .populate('reserva_id');

    if (!table || !table.estado) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }

    const tableObj = table.toObject();
    tableObj.disponibilidad = table.table_state === 'Disponible' ? '✅ Libre' : `❌ ${table.table_state}`;

    res.status(200).json({
      success: true,
      table: tableObj
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de mesa no válido',
        error: 'INVALID_ID'
      });
    }
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

    const updated = await Table.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Mesa no encontrada'
      });
    }

    const tableObj = updated.toObject();
    tableObj.disponibilidad = updated.table_state === 'Disponible' ? '✅ Libre' : `❌ ${updated.table_state}`;

    res.status(200).json({
      success: true,
      message: 'Mesa actualizada',
      table: tableObj
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de mesa no válido',
        error: 'INVALID_ID'
      });
    }
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

    const tableObj = table.toObject();
    tableObj.disponibilidad = table.table_state === 'Disponible' ? '✅ Libre' : `❌ ${table.table_state}`;

    res.status(200).json({
      success: true,
      message: 'Mesa eliminada',
      table: tableObj
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de mesa no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar mesa',
      error: error.message
    });
  }
};

export const getRestaurantLayout = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const tables = await Table.find({
      restaurant_id: restaurantId,
      estado: true
    }).select('_id floor_plan updatedAt');

    const layout = tables.reduce((acc, table) => {
      acc[table._id] = {
        x: table.floor_plan?.x ?? 0,
        y: table.floor_plan?.y ?? 0,
        width: table.floor_plan?.width ?? null,
        height: table.floor_plan?.height ?? null,
        updatedAt: table.updatedAt
      };
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      restaurant_id: restaurantId,
      layout
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de restaurante no válido',
        error: 'INVALID_ID'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al obtener el layout de mesas',
      error: error.message
    });
  }
};

export const saveRestaurantLayout = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { layouts } = req.body;

    const tableIds = layouts.map((item) => item.table_id);

    const existingTables = await Table.find({
      _id: { $in: tableIds },
      restaurant_id: restaurantId,
      estado: true
    }).select('_id');

    if (existingTables.length !== tableIds.length) {
      return res.status(404).json({
        success: false,
        message: 'Una o más mesas no existen para este restaurante'
      });
    }

    const operations = layouts.map((item) => ({
      updateOne: {
        filter: { _id: item.table_id, restaurant_id: restaurantId, estado: true },
        update: {
          $set: {
            floor_plan: {
              x: item.x,
              y: item.y,
              width: item.width ?? null,
              height: item.height ?? null
            }
          }
        }
      }
    }));

    await Table.bulkWrite(operations);

    return res.status(200).json({
      success: true,
      message: 'Layout de mesas actualizado',
      updated: operations.length
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de restaurante o mesa no válido',
        error: 'INVALID_ID'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al guardar el layout de mesas',
      error: error.message
    });
  }
};