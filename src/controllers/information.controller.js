import Information from '../models/information.model.js';
import Restaurante from '../models/restaurant.model.js';
import { Roles } from '../constants/roles.js';

export const createInformation = async (req, res) => {
    try {
        const {
            information,
            title,
            type,
            statistics,
            restaurantId,
            restaurant_id
        } = req.body;

        const finalRestaurantId = restaurantId || restaurant_id;

        const restaurante = await Restaurante.findById(finalRestaurantId);
        if (!restaurante || !restaurante.estado) {
            return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        }

        const info = new Information({
            information,
            title,
            type,
            statistics: statistics || {},
            restaurantId: finalRestaurantId,
            usuario: req.user.id
        });

        await info.save();

        res.status(201).json({ success: true, message: 'Informacion creada', information: info });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de información o restaurante no válido',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ success: false, message: 'Error al crear informacion', error: error.message });
    }
};

export const getInformations = async (req, res) => {
    try {
        const { restaurantId } = req.query;
        const filter = { estado: true };
        if (restaurantId) filter.restaurantId = restaurantId;

        const items = await Information.find(filter).populate('usuario', 'nombre email');

        res.status(200).json({ success: true, total: items.length, informations: items });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener informacion', error: error.message });
    }
};

export const getInformationById = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Information.findById(id).populate('usuario', 'nombre email');
        if (!item || !item.estado) {
            return res.status(404).json({ success: false, message: 'Informacion no encontrada' });
        }

        res.status(200).json({ success: true, information: item });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de información no válido',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ success: false, message: 'Error al obtener informacion', error: error.message });
    }
};

export const updateInformation = async (req, res) => {
    try {
        const { id } = req.params;
        const fallbackId = req.body?._id || req.body?.id;
        const informationId = id && id !== 'undefined' ? id : fallbackId;

        if (!informationId) {
            return res.status(400).json({
                success: false,
                message: 'ID de información requerido',
                error: 'MISSING_ID'
            });
        }

        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.id;

        if (updateData.restaurant_id && !updateData.restaurantId) {
            updateData.restaurantId = updateData.restaurant_id;
        }
        delete updateData.restaurant_id;

        const updated = await Information.findByIdAndUpdate(informationId, updateData, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Informacion no encontrada' });

        res.status(200).json({ success: true, message: 'Informacion actualizada', information: updated });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de información no válido',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ success: false, message: 'Error al actualizar informacion', error: error.message });
    }
};

export const deleteInformation = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Information.findByIdAndUpdate(id, { estado: false }, { new: true });
        if (!item) return res.status(404).json({ success: false, message: 'Informacion no encontrada' });

        res.status(200).json({ success: true, message: 'Información eliminada', information: item });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de información no válido',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ success: false, message: 'Error al eliminar informacion', error: error.message });
    }
};
