import {
    createMenuService,
    getMenusService,
    getMenusByRestaurantService,
    getMenuByIdService,
    searchMenuService,
    updateMenuService,
    deleteMenuService,
    addDishToMenuService,
    removeDishFromMenuService,
    addBeverageToMenuService,
    removeBeverageFromMenuService
} from '../services/menu.service.js';

export const createMenu = async (req, res) => {
    try {
        const menu = await createMenuService(req.body);
        res.status(201).json({
            success: true,
            message: "Menú creado exitosamente",
            data: menu
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
            message: "Error al crear el menú",
            error: error.message
        });
    }
};

export const getMenus = async (req, res) => {
    try {
        const menus = await getMenusService();
        res.status(200).json({
            success: true,
            message: "Menús obtenidos exitosamente",
            data: menus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los menús",
            error: error.message
        });
    }
};

export const getMenusByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const menus = await getMenusByRestaurantService(restaurantId);
        res.status(200).json({
            success: true,
            message: "Menús del restaurante obtenidos exitosamente",
            data: menus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los menús",
            error: error.message
        });
    }
};

export const getMenuById = async (req, res) => {
    try {
        const menu = await getMenuByIdService(req.params.id);
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menú no encontrado"
            });
        }
        res.status(200).json({
            success: true,
            message: "Menú obtenido exitosamente",
            data: menu
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID de menú no válido",
                error: "INVALID_ID"
            });
        }
        res.status(500).json({
            success: false,
            message: "Error al obtener el menú",
            error: error.message
        });
    }
};

export const searchMenu = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: "El término de búsqueda es obligatorio"
            });
        }
        const menus = await searchMenuService(searchTerm);
        if (!menus || menus.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron menús con ese término"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Menús encontrados exitosamente",
            count: menus.length,
            data: menus
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al buscar los menús",
            error: error.message
        });
    }
};

export const updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "El ID del menú es obligatorio"
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se proporcionaron datos para actualizar"
            });
        }

        const menu = await updateMenuService(id, updateData);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menú no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Menú actualizado exitosamente",
            data: menu
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID de menú no válido",
                error: "INVALID_ID"
            });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: Object.values(error.errors).map(e => ({ field: e.path, message: e.message }))
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el menú",
            error: error.message
        });
    }
};

export const deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "El ID del menú es obligatorio"
            });
        }

        const menu = await deleteMenuService(id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menú no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Menú eliminado exitosamente"
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID de menú no válido",
                error: "INVALID_ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error al eliminar el menú",
            error: error.message
        });
    }
};

export const addDishToMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        const { dishId } = req.body;

        if (!menuId || !dishId) {
            return res.status(400).json({
                success: false,
                message: "El ID del menú y del platillo son obligatorios"
            });
        }

        const menu = await addDishToMenuService(menuId, dishId);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menú no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Platillo agregado al menú exitosamente",
            data: menu
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID no válido",
                error: "INVALID_ID"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al agregar platillo al menú",
            error: error.message
        });
    }
};

export const removeDishFromMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        const { dishId } = req.body;

        if (!menuId || !dishId) {
            return res.status(400).json({
                success: false,
                message: "El ID del menú y del platillo son obligatorios"
            });
        }

        const menu = await removeDishFromMenuService(menuId, dishId);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menú no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Platillo removido del menú exitosamente",
            data: menu
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID no válido",
                error: "INVALID_ID"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al remover platillo del menú",
            error: error.message
        });
    }
};

export const addBeverageToMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        const { beverageId } = req.body;

        if (!menuId || !beverageId) {
            return res.status(400).json({
                success: false,
                message: "El ID del menú y de la bebida son obligatorios"
            });
        }

        const menu = await addBeverageToMenuService(menuId, beverageId);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menú no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Bebida agregada al menú exitosamente",
            data: menu
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID no válido",
                error: "INVALID_ID"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al agregar bebida al menú",
            error: error.message
        });
    }
};

export const removeBeverageFromMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        const { beverageId } = req.body;

        if (!menuId || !beverageId) {
            return res.status(400).json({
                success: false,
                message: "El ID del menú y de la bebida son obligatorios"
            });
        }

        const menu = await removeBeverageFromMenuService(menuId, beverageId);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menú no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Bebida removida del menú exitosamente",
            data: menu
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID no válido",
                error: "INVALID_ID"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al remover bebida del menú",
            error: error.message
        });
    }
};