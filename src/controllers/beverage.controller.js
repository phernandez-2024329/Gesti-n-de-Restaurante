import {
  createBeverageService,
  getBeveragesByRestaurantService,
  getBeverageByIdService,
  updateBeverageService,
  deleteBeverageService,
  searchBeveragesByNameService
} from '../services/beverage.service.js';

export const createBeverage = async (req, res) => {
  try {
    const beverage = await createBeverageService(req.body);
    res.status(201).json({
      success: true,
      message: 'Bebida creada exitosamente',
      data: beverage
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
      message: 'Error al crear la bebida',
      error: error.message
    });
  }
};

export const getBeveragesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const beverages = await getBeveragesByRestaurantService(restaurantId);
    res.status(200).json({
      success: true,
      message: 'Bebidas obtenidas exitosamente',
      data: beverages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las bebidas',
      error: error.message
    });
  }
};

export const getBeverageById = async (req, res) => {
  try {
    const { id } = req.params;
    const beverage = await getBeverageByIdService(id);
    if (!beverage) {
      return res.status(404).json({
        success: false,
        message: 'Bebida no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Bebida obtenida exitosamente',
      data: beverage
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de bebida no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener la bebida',
      error: error.message
    });
  }
};

export const updateBeverage = async (req, res) => {
  try {
    const { id } = req.params;
    const beverage = await updateBeverageService(id, req.body);
    if (!beverage) {
      return res.status(404).json({
        success: false,
        message: 'Bebida no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Bebida actualizada exitosamente',
      data: beverage
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de bebida no válido',
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
      message: 'Error al actualizar la bebida',
      error: error.message
    });
  }
};

export const deleteBeverage = async (req, res) => {
  try {
    const { id } = req.params;
    const beverage = await deleteBeverageService(id);
    if (!beverage) {
      return res.status(404).json({
        success: false,
        message: 'Bebida no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Bebida eliminada exitosamente'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de bebida no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la bebida',
      error: error.message
    });
  }
};

export const searchBeveragesByName = async (req, res) => {
  try {
    const { name } = req.query;
    const { restaurantId } = req.params;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la bebida es obligatorio para la búsqueda'
      });
    }
    
    const beverages = await searchBeveragesByNameService(name, restaurantId);
    res.status(200).json({
      success: true,
      message: 'Bebidas encontradas',
      count: beverages.length,
      data: beverages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar bebidas',
      error: error.message
    });
  }
};
