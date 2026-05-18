import Beverage from '../models/beverage.model.js';

export const createBeverageService = async (data) => {
  const beverage = new Beverage(data);
  return await beverage.save();
};

export const getBeveragesByRestaurantService = async (restaurantId) => {
  return await Beverage.find({ restaurant_id: restaurantId, estado: true });
};

export const getBeverageByIdService = async (id) => {
  return await Beverage.findOne({ _id: id, estado: true });
};

export const updateBeverageService = async (id, data) => {
  return await Beverage.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteBeverageService = async (id) => {
  return await Beverage.findByIdAndUpdate(id, { estado: false }, { new: true });
};

export const searchBeveragesByNameService = async (name, restaurantId) => {
  return await Beverage.find({
    restaurant_id: restaurantId,
    estado: true,
    name: { $regex: name, $options: 'i' }
  });
};
