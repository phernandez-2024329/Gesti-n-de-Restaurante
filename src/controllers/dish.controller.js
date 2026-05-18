import {
  createDishService,
  getDishesByRestaurantService,
  getDishByIdService,
  updateDishService,
  deleteDishService,
  searchDishesByNameService
} from '../services/dish.service.js';

const normalizeDishPayload = (body = {}) => {
  const normalizedTypeMap = {
    entrada: 'Entrada',
    'plato fuerte': 'Plato_fuerte',
    plato_fuerte: 'Plato_fuerte',
    'plato-fuerte': 'Plato_fuerte',
    postre: 'Postre',
    acompañamiento: 'Acompañamiento',
    acompanamiento: 'Acompañamiento'
  };

  const rawType = typeof body.type === 'string' ? body.type.trim() : body.type;
  const normalizedType = typeof rawType === 'string'
    ? (normalizedTypeMap[rawType.toLowerCase()] || rawType)
    : rawType;

  return {
    ...body,
    name: body.name?.trim?.() ?? body.name,
    description: body.description?.trim?.() ?? body.description,
    type: normalizedType,
    price: body.price !== undefined ? Number(body.price) : body.price,
    available: body.available === 'true' ? true : body.available === 'false' ? false : body.available,
    restaurant_id: body.restaurant_id ?? body.restaurantId ?? body.Restaurant_id
  };
};

export const createDish = async (req, res) => {
  try {
    const dish = await createDishService(normalizeDishPayload(req.body));
    res.status(201).json({
      success: true,
      message: 'Platillo creado exitosamente',
      data: dish
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
      message: 'Error al crear el platillo',
      error: error.message
    });
  }
};

export const getDishesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const dishes = await getDishesByRestaurantService(restaurantId);
    res.status(200).json({
      success: true,
      message: 'Platillos obtenidos exitosamente',
      data: dishes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los platillos',
      error: error.message
    });
  }
};

export const getDishById = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await getDishByIdService(id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Platillo no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Platillo obtenido exitosamente',
      data: dish
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de platillo no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener el platillo',
      error: error.message
    });
  }
};

export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await updateDishService(id, normalizeDishPayload(req.body));
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Platillo no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Platillo actualizado exitosamente',
      data: dish
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de platillo no válido',
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
      message: 'Error al actualizar el platillo',
      error: error.message
    });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await deleteDishService(id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Platillo no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Platillo eliminado exitosamente'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de platillo no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el platillo',
      error: error.message
    });
  }
};

export const searchDishesByName = async (req, res) => {
  try {
    const { name } = req.query;
    const { restaurantId } = req.params;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del platillo es obligatorio para la búsqueda'
      });
    }
    
    const dishes = await searchDishesByNameService(name, restaurantId);
    res.status(200).json({
      success: true,
      message: 'Platillos encontrados',
      count: dishes.length,
      data: dishes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar platillos',
      error: error.message
    });
  }
};
