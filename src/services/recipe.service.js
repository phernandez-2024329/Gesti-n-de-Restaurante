import Recipe from '../models/recipe.model.js';

export const createRecipeService = async (data) => {
  const recipe = new Recipe(data);
  return await recipe.save();
};

export const getRecipesByDishService = async (dishId) => {
  return await Recipe.findOne({ dish_id: dishId, estado: true })
    .populate('dish_id')
    .populate('beverage_id')
    .populate('restaurant_id')
    .populate('ingredients.inventory_id');
};

export const getRecipesByBeverageService = async (beverageId) => {
  return await Recipe.findOne({ beverage_id: beverageId, estado: true })
    .populate('dish_id')
    .populate('beverage_id')
    .populate('restaurant_id')
    .populate('ingredients.inventory_id');
};

export const getRecipeByProductService = async (productId, productType) => {
  // productType puede ser 'dish' o 'beverage'
  const query = productType === 'beverage' 
    ? { beverage_id: productId, estado: true }
    : { dish_id: productId, estado: true };
  
  return await Recipe.findOne(query)
    .populate('dish_id')
    .populate('beverage_id')
    .populate('restaurant_id')
    .populate('ingredients.inventory_id');
};

export const getRecipesByRestaurantService = async (restaurantId) => {
  return await Recipe.find({ restaurant_id: restaurantId, estado: true })
    .populate('dish_id')
    .populate('beverage_id')
    .populate('restaurant_id')
    .populate('ingredients.inventory_id');
};

export const getRecipeByIdService = async (id) => {
  return await Recipe.findOne({ _id: id, estado: true })
    .populate('dish_id')
    .populate('beverage_id')
    .populate('restaurant_id')
    .populate('ingredients.inventory_id');
};

export const updateRecipeService = async (id, data) => {
  return await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('dish_id')
    .populate('beverage_id')
    .populate('restaurant_id')
    .populate('ingredients.inventory_id');
};

export const deleteRecipeService = async (id) => {
  return await Recipe.findByIdAndUpdate(id, { estado: false }, { new: true });
};

export const addIngredientToRecipeService = async (recipeId, ingredient) => {
  return await Recipe.findByIdAndUpdate(
    recipeId,
    { $push: { ingredients: ingredient } },
    { new: true }
  )
    .populate('dish_id')
    .populate('beverage_id')
    .populate('restaurant_id')
    .populate('ingredients.inventory_id');
};

export const removeIngredientFromRecipeService = async (recipeId, ingredientId) => {
  return await Recipe.findByIdAndUpdate(
    recipeId,
    { $pull: { ingredients: { _id: ingredientId } } },
    { new: true }
  )
    .populate('dish_id')
    .populate('beverage_id')
    .populate('restaurant_id')
    .populate('ingredients.inventory_id');
};

export const updateIngredientInRecipeService = async (recipeId, ingredientId, data) => {
  return await Recipe.findOneAndUpdate(
    { _id: recipeId, 'ingredients._id': ingredientId },
    {
      $set: {
        'ingredients.$.inventory_id': data.inventory_id || undefined,
        'ingredients.$.quantity': data.quantity || undefined,
        'ingredients.$.unit': data.unit || undefined
      }
    },
    { new: true }
  )
    .populate('dish_id')
    .populate('beverage_id')
    .populate('restaurant_id')
    .populate('ingredients.inventory_id');
};
