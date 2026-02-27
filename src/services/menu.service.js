import Menu from '../models/menu.model.js';

export const createMenuService = async (data) => {
    const {
    Menu_id,
    Menu_Plate,
    Menu_Price,
    Menu_Drink,
    Menu_type_plate,
    Menu_type_drink,
    Menu_Promotion,
    Menu_description_plate,
    Restaurant_id
    } = data;

    const menu = new Menu({
        Menu_id,
        Menu_Plate,
        Menu_Price,
        Menu_Drink,
        Menu_type_plate,
        Menu_type_drink,
        Menu_Promotion,
        Menu_description_plate,
        Restaurant_id
    });
    return await menu.save();
};

export const getMenusService = () => {
    return Menu.find({ estado: true });
};

export const getMenuByIdService = async (id) => {
    const menu = await Menu.findById(id);

    if (!menu || !menu.estado) {
        return null;
    }

    return menu;
};

export const searchMenuService = async (searchTerm) => {
    const numericTerm = Number(searchTerm);

    if (!isNaN(numericTerm)) {
        return await Menu.find({
            estado: true,
            Menu_Price: numericTerm
        });
    }

    const byPlate = await Menu.find({
        estado: true,
        Menu_Plate: searchTerm
    });

    if (byPlate.length > 0) return byPlate;

    const byDrink = await Menu.find({
        estado: true,
        Menu_Drink: searchTerm
    });

    if (byDrink.length > 0) return byDrink;

    const byTypePlate = await Menu.find({
        estado: true,
        Menu_type_plate: searchTerm
    });

    if (byTypePlate.length > 0) return byTypePlate;

    return await Menu.find({
        estado: true,
        Menu_type_drink: searchTerm
    });
};

export const updateMenuService = async (id, data) => {
    return await Menu.findOneAndUpdate(
        { _id: id, estado: true },
        data,
        { new: true }
    );
};

export const deleteMenuService = async (id) => {
    return await Menu.findOneAndUpdate(
        { _id: id, estado: true },
        { estado: false },
        { new: true }
    );
};
