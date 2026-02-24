import {
    createMesaService,
    getMesasService,
    getMesaByIdService,
    updateMesaService,
    deleteMesaService
} from '../services/mesa.service.js';

export const createMesa = async (req, res) => {
    try {
        const mesa = await createMesaService(req.body);
        return res.status(201).json({
            message: "Mesa creada exitosamente",
            data: mesa
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la mesa",
            error: error.message
        });
    }
};

export const getMesas = async (req, res) => {
    try {
        const mesas = await getMesasService();
        return res.status(200).json({
            message: "Mesas obtenidas exitosamente",
            count: mesas.length,
            data: mesas
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener las mesas",
            error: error.message
        });
    }
};

export const getMesaById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "El ID de la mesa es obligatorio"
            });
        }

        const mesa = await getMesaByIdService(id);

        if (!mesa) {
            return res.status(404).json({
                message: "Mesa no encontrada"
            });
        }

        return res.status(200).json({
            message: "Mesa obtenida exitosamente",
            data: mesa
        });

    } catch (error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                message: "ID de mesa no válido"
            });
        }
    }
};

export const searchMesas = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        if (!searchTerm) {
            return res.status(400).json({
                message: "El término de búsqueda es obligatorio"
            });
        }
        const mesas = await searchMesaService(searchTerm);
        return res.status(200).json({
            message: "Búsqueda completada",
            count: mesas.length,
            data: mesas
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al buscar mesas",
            error: error.message
        });
    }
}

export const updateMesa = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({
                message: "El ID de la mesa es obligatorio"
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No se proporcionaron datos para actualizar"
            });
        }

        const mesa = await updateMesaService(id, updateData);

        if (!mesa) {
            return res.status(404).json({
                message: "Mesa no encontrada"
            });
        }

        return res.status(200).json({
            message: "Mesa actualizada exitosamente",
            data: mesa
        });

    } catch (error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                message: "ID de mesa no válido"
            });
        }

        return res.status(500).json({
            message: "Error al actualizar la mesa",
            error: error.message
        });
    }
};

export const deleteMesa = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "El ID de la mesa es obligatorio"
            });
        }

        const mesa = await deleteMesaService(id);

        if (!mesa) {
            return res.status(404).json({
                message: "Mesa no encontrada"
            });
        }

        return res.status(200).json({
            message: "Mesa eliminada exitosamente",
            data: mesa
        });

    } catch (error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                message: "ID de mesa no válido"
            });
        }
        
        return res.status(500).json({
            message: "Error al eliminar la mesa",
            error: error.message
        });
    }
}