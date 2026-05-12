import Dish from '../models/dish.model.js';

export const createDishService = async (data) => {
  const dish = new Dish(data);
  return await dish.save();
};

export const getDishesByRestaurantService = async (restaurantId) => {
  return await Dish.find({ restaurant_id: restaurantId, estado: true });
};

export const getDishByIdService = async (id) => {
  return await Dish.findOne({ _id: id, estado: true });
};

export const updateDishService = async (id, data) => {
  return await Dish.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteDishService = async (id) => {
  return await Dish.findByIdAndUpdate(id, { estado: false }, { new: true });
};

export const searchDishesByNameService = async (name, restaurantId) => {
  return await Dish.find({
    restaurant_id: restaurantId,
    estado: true,
    name: { $regex: name, $options: 'i' }
  });
};
