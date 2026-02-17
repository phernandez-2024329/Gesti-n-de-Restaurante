import Restaurante from "../models/restaurante.model.js";

export const createRestaurante = async (req, res) => {
    try {
        const { nombre, direccion } = req.body;

        const restaurante = new Restaurante({
            nombre,
            direccion,
            usuario: req.user.id
        });

        await restaurante.save();

        res.status(201).json({
            success: true,
            message: "Restaurante creado correctamente",
            restaurante
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el restaurante",
            error: error.message
        });
    }
};

export const getRestaurantes = async (req, res) => {
    try {
        const restaurantes = await Restaurante.find({ estado: true })
            .populate("usuario", "nombre email");

        res.status(200).json({
            success: true,
            restaurantes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los restaurantes",
            error: error.message
        });
    }
};

export const getRestauranteById = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurante = await Restaurante.findById(id)
            .populate("usuario", "nombre email");

        if (!restaurante || !restaurante.estado) {
            return res.status(404).json({
                success: false,
                message: "Restaurante no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            restaurante
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el restaurante",
            error: error.message
        });
    }
};

export const updateRestaurante = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurante = await Restaurante.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!restaurante) {
            return res.status(404).json({
                success: false,
                message: "Restaurante no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Restaurante actualizado correctamente",
            restaurante
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el restaurante",
            error: error.message
        });
    }
};

export const deleteRestaurante = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurante = await Restaurante.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );

        if (!restaurante) {
            return res.status(404).json({
                success: false,
                message: "Restaurante no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Restaurante eliminado",
            restaurante
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el restaurante",
            error: error.message
        });
    }
};
