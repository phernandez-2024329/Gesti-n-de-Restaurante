import { Router } from 'express';
import {
  createRecipe,
  getRecipesByDish,
  getRecipesByBeverage,
  getRecipesByRestaurant,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addIngredientToRecipe,
  removeIngredientFromRecipe,
  updateIngredientInRecipe
} from '../controllers/recipe.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// Crear receta
router.post('/', validateJWT, createRecipe);

// Obtener receta por platillo
router.get('/dish/:dishId', getRecipesByDish);

// Obtener receta por bebida
router.get('/beverage/:beverageId', getRecipesByBeverage);

// Obtener todas las recetas de un restaurante
router.get('/restaurant/:restaurantId', getRecipesByRestaurant);

// Obtener receta por ID
router.get('/:id', getRecipeById);

// Actualizar receta
router.put('/:id', validateJWT, updateRecipe);

// Eliminar receta
router.delete('/:id', validateJWT, deleteRecipe);

// Agregar ingrediente a receta
router.post('/:id/ingredients', validateJWT, addIngredientToRecipe);

// Remover ingrediente de receta
router.delete('/:id/ingredients/:ingredientId', validateJWT, removeIngredientFromRecipe);

// Actualizar ingrediente en receta
router.put('/:id/ingredients/:ingredientId', validateJWT, updateIngredientInRecipe);

export default router;
