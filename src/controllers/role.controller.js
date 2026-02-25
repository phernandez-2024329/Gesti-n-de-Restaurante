import { Roles } from '../constants/roles.js';

// devuelve todos los roles conocidos por el sistema
export const getRoles = (req, res) => {
    const items = Object.entries(Roles).map(([key, value]) => ({ id: value, name: key }));
    res.status(200).json({ success: true, total: items.length, roles: items });
};