import {
  createRecipeService,
  getRecipesByDishService,
  getRecipesByBeverageService,
  getRecipeByProductService,
  getRecipesByRestaurantService,
  getRecipeByIdService,
  updateRecipeService,
  deleteRecipeService,
  addIngredientToRecipeService,
  removeIngredientFromRecipeService,
  updateIngredientInRecipeService
} from '../services/recipe.service.js';

export const createRecipe = async (req, res) => {
  try {
    const recipe = await createRecipeService(req.body);
    res.status(201).json({
      success: true,
      message: 'Receta creada exitosamente',
      data: recipe
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
      message: 'Error al crear la receta',
      error: error.message
    });
  }
};

export const getRecipesByDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const recipe = await getRecipesByDishService(dishId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'No hay receta para este platillo'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Receta obtenida',
      data: recipe
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener la receta',
      error: error.message
    });
  }
};

export const getRecipesByBeverage = async (req, res) => {
  try {
    const { beverageId } = req.params;
    const recipe = await getRecipesByBeverageService(beverageId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'No hay receta para esta bebida'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Receta obtenida',
      data: recipe
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener la receta',
      error: error.message
    });
  }
};

export const getRecipesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const recipes = await getRecipesByRestaurantService(restaurantId);
    res.status(200).json({
      success: true,
      message: 'Recetas del restaurante obtenidas',
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener las recetas',
      error: error.message
    });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await getRecipeByIdService(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Receta no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Receta obtenida',
      data: recipe
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener la receta',
      error: error.message
    });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await updateRecipeService(id, req.body);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Receta no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Receta actualizada',
      data: recipe
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID no válido',
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
      message: 'Error al actualizar la receta',
      error: error.message
    });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await deleteRecipeService(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Receta no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Receta eliminada'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la receta',
      error: error.message
    });
  }
};

export const addIngredientToRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { inventory_id, quantity, unit } = req.body;

    if (!inventory_id || !quantity || !unit) {
      return res.status(400).json({
        success: false,
        message: 'inventory_id, quantity y unit son obligatorios'
      });
    }

    const recipe = await addIngredientToRecipeService(id, { inventory_id, quantity, unit });
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Receta no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Ingrediente agregado a la receta',
      data: recipe
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID no válido',
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
      message: 'Error al agregar ingrediente',
      error: error.message
    });
  }
};

export const removeIngredientFromRecipe = async (req, res) => {
  try {
    const { id, ingredientId } = req.params;

    const recipe = await removeIngredientFromRecipeService(id, ingredientId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Receta no encontrada'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Ingrediente removido de la receta',
      data: recipe
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al remover ingrediente',
      error: error.message
    });
  }
};

export const updateIngredientInRecipe = async (req, res) => {
  try {
    const { id, ingredientId } = req.params;
    const { inventory_id, quantity, unit } = req.body;

    const recipe = await updateIngredientInRecipeService(id, ingredientId, {
      inventory_id,
      quantity,
      unit
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Receta o ingrediente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ingrediente actualizado',
      data: recipe
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID no válido',
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
      message: 'Error al actualizar ingrediente',
      error: error.message
    });
  }
};
