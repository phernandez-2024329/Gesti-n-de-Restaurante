import { Roles } from '../constants/roles.js';

// devuelve todos los roles conocidos por el sistema
export const getRoles = (req, res) => {
    try {
        const items = Object.entries(Roles).map(([key, value]) => ({ id: value, name: key }));
        res.status(200).json({ success: true, total: items.length, roles: items });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los roles',
            error: error.message
        });
    }
};