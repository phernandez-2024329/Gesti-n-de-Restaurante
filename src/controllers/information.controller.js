import Information from '../models/information.model.js';
import Restaurante from '../models/restaurantes.model.js';
import { Roles } from '../constants/roles.js';

export const createInformation = async (req, res) => {
    try {
        const { information, title, type, statistics, restaurantId } = req.body;

        const restaurante = await Restaurante.findById(restaurantId);
        if (!restaurante || !restaurante.estado) {
            return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        }

        const info = new Information({
            information,
            title,
            type,
            statistics: statistics || {},
            restaurantId,
            usuario: req.user.id
        });

        await info.save();

        res.status(201).json({ success: true, message: 'Informacion creada', information: info });

    } catch (error) {
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
        res.status(500).json({ success: false, message: 'Error al obtener informacion', error: error.message });
    }
};

export const updateInformation = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Information.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Informacion no encontrada' });

        res.status(200).json({ success: true, message: 'Informacion actualizada', information: updated });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar informacion', error: error.message });
    }
};

export const deleteInformation = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Information.findByIdAndUpdate(id, { estado: false }, { new: true });
        if (!item) return res.status(404).json({ success: false, message: 'Informacion no encontrada' });

        res.status(200).json({ success: true, message: 'Information eliminada', information: item });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar informacion', error: error.message });
    }
};
