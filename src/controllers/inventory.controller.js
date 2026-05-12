import {
  createInventoryService,
  getInventoryByRestaurantService,
  getInventoryByIdService,
  updateInventoryService,
  deleteInventoryService,
  decreaseInventoryService,
  increaseInventoryService,
  searchInventoryByNameService
} from '../services/inventory.service.js';

export const createInventory = async (req, res) => {
  try {
    const item = await createInventoryService(req.body);
    res.status(201).json({
      success: true,
      message: 'Artículo de inventario creado exitosamente',
      data: item
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map(e => ({ field: e.path, message: e.message }))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear inventario',
      error: error.message
    });
  }
};

export const getInventoryByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const items = await getInventoryByRestaurantService(restaurantId);
    res.status(200).json({
      success: true,
      message: 'Inventario del restaurante obtenido',
      count: items.length,
      data: items
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de restaurante no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener inventario',
      error: error.message
    });
  }
};

export const getInventory = async (req, res) => {
  try {
    const items = await getInventoryByRestaurantService(req.query.restaurantId || req.user?.restaurant_id);
    res.status(200).json({
      success: true,
      message: 'Inventario obtenido',
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener inventario',
      error: error.message
    });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getInventoryByIdService(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Artículo obtenido',
      data: item
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de artículo no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener inventario',
      error: error.message
    });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateInventoryService(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Artículo actualizado exitosamente',
      data: updated
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de artículo no válido',
        error: 'INVALID_ID'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map(e => ({ field: e.path, message: e.message }))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar inventario',
      error: error.message
    });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteInventoryService(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Artículo eliminado exitosamente'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de artículo no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar inventario',
      error: error.message
    });
  }
};

export const decreaseInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad a descontar debe ser mayor a 0'
      });
    }

    const updated = await decreaseInventoryService(id, quantity, req.body.restaurant_id || req.user?.restaurant_id);
    res.status(200).json({
      success: true,
      message: 'Inventario descontado exitosamente',
      data: updated
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de artículo no válido',
        error: 'INVALID_ID'
      });
    }
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.code
      });
    }
    if (error.code === 'INVENTORY_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: error.message,
        error: error.code
      });
    }
    if (error.code === 'INVENTORY_RESTAURANT_MISMATCH') {
      return res.status(403).json({
        success: false,
        message: error.message,
        error: error.code
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const increaseInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad a agregar debe ser mayor a 0'
      });
    }

    const updated = await increaseInventoryService(id, quantity);
    res.status(200).json({
      success: true,
      message: 'Inventario incrementado exitosamente',
      data: updated
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de artículo no válido',
        error: 'INVALID_ID'
      });
    }
    if (error.code === 'INVALID_ID') {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.code
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al incrementar inventario',
      error: error.message
    });
  }
};

export const searchInventoryByName = async (req, res) => {
  try {
    const { name } = req.query;
    const { restaurantId } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del artículo es obligatorio para la búsqueda'
      });
    }

    const items = await searchInventoryByNameService(name, restaurantId);
    res.status(200).json({
      success: true,
      message: 'Artículos encontrados',
      count: items.length,
      data: items
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de restaurante no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al buscar artículos',
      error: error.message
    });
  }
};
