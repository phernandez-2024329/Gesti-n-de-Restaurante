import {
    createMenuService,
    getMenusService,
    getMenuByIdService,
    searchMenuService,
    updateMenuService,
    deleteMenuService
} from '../services/menu.service.js';

export const createMenu = async (req, res) => {
    try {
        const menu = await createMenuService(req.body);
        res.status(201).json({
            message: "Menú creado exitosamente",
            data: menu
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al crear el menú",
            error: error.message
        });
    }
};

export const getMenus = async (req, res) => {
    try {
        const menus = await getMenusService();
        res.status(200).json({
            message: "Menús obtenidos exitosamente",
            data: menus
        });
    } catch (error) {
        res.status(500).json({
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
                message: "Menú no encontrado"
            });
        }
        res.status(200).json({
            message: "Menú obtenido exitosamente",
            data: menu
        });
    } catch (error) {
        res.status(500).json({
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
                message: "El término de búsqueda es obligatorio"
            });
        }

        const menus = await searchMenuService(searchTerm);

        if (menus.length === 0) {
            return res.status(404).json({
                message: "No se encontraron menús con ese término"
            });
        }

        return res.status(200).json({
            message: "Menús encontrados exitosamente",
            count: menus.length,
            data: menus
        });

    } catch (error) {
        return res.status(500).json({
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
                message: "El ID del menú es obligatorio"
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No se proporcionaron datos para actualizar"
            });
        }

        const menu = await updateMenuService(id, updateData);

        if (!menu) {
            return res.status(404).json({
                message: "Menú no encontrado"
            });
        }

        return res.status(200).json({
            message: "Menú actualizado exitosamente",
            data: menu
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "ID de menú no válido"
            });
        }

        return res.status(500).json({
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
                message: "Menú no encontrado"
            });
        }

        return res.status(200).json({
            message: "Menú eliminado exitosamente",
            data: menu
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "ID de menú no válido"
            });
        }

        return res.status(500).json({
            message: "Error al eliminar el menú",
            error: error.message
        });
    }
};