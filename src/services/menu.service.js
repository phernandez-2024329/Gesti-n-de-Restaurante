import Menu from '../models/menu.model.js';

export const createMenuService = async (data) => {
    const {
        name,
        description,
        dishes,
        beverages,
        promotion,
        restaurant_id
    } = data;

    const menu = new Menu({
        name,
        description,
        dishes: dishes || [],
        beverages: beverages || [],
        promotion,
        restaurant_id
    });
    return await menu.save();
};

export const getMenusService = () => {
    return Menu.find({ estado: true })
        .populate('dishes')
        .populate('beverages');
};

export const getMenusByRestaurantService = async (restaurantId) => {
    return await Menu.find({ restaurant_id: restaurantId, estado: true })
        .populate('dishes')
        .populate('beverages');
};

export const getMenuByIdService = async (id) => {
    return await Menu.findOne({ _id: id, estado: true })
        .populate('dishes')
        .populate('beverages');
};

export const searchMenuService = async (searchTerm) => {
    return await Menu.find({
        estado: true,
        name: { $regex: searchTerm, $options: 'i' }
    })
    .populate('dishes')
    .populate('beverages');
};

export const updateMenuService = async (id, data) => {
    return await Menu.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    ).populate('dishes').populate('beverages');
};

export const deleteMenuService = async (id) => {
    return await Menu.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
    );
};

export const addDishToMenuService = async (menuId, dishId) => {
    return await Menu.findByIdAndUpdate(
        menuId,
        { $addToSet: { dishes: dishId } },
        { new: true }
    ).populate('dishes').populate('beverages');
};

export const removeDishFromMenuService = async (menuId, dishId) => {
    return await Menu.findByIdAndUpdate(
        menuId,
        { $pull: { dishes: dishId } },
        { new: true }
    ).populate('dishes').populate('beverages');
};

export const addBeverageToMenuService = async (menuId, beverageId) => {
    return await Menu.findByIdAndUpdate(
        menuId,
        { $addToSet: { beverages: beverageId } },
        { new: true }
    ).populate('dishes').populate('beverages');
};

export const removeBeverageFromMenuService = async (menuId, beverageId) => {
    return await Menu.findByIdAndUpdate(
        menuId,
        { $pull: { beverages: beverageId } },
        { new: true }
    ).populate('dishes').populate('beverages');
};
