import Usuario from '../models/user.model.js';
import { generateJWT } from '../../helpers/generate-jwt.js';

export const registerUser = async (req, res) => {
    try {
        const { nombre, username, email, password, telefono, rol } = req.body;

        const rolAsignado = req.user?.role === 'ADMIN' ? (rol || 'CLIENTE') : 'CLIENTE';

        const usuario = new Usuario({ nombre, username, email, password, telefono, rol: rolAsignado });
        await usuario.save();

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: { id: usuario._id, nombre: usuario.nombre, username: usuario.username, email: usuario.email, rol: usuario.rol }
        });

    } catch (error) {
        if (error.code === 11000) {
            const campo = Object.keys(error.keyValue)[0];
            return res.status(400).json({ success: false, message: `El "${campo}" ya está registrado` });
        }
        res.status(500).json({ success: false, message: 'Error al registrar', error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        if (!usuario.estado) {
            return res.status(423).json({ success: false, message: 'Cuenta desactivada. Contacta al administrador.', error: 'ACCOUNT_DISABLED' });
        }

        const passwordValida = await usuario.comparePassword(password);
        if (!passwordValida) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const token = await generateJWT(usuario._id, { role: usuario.rol });
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            expiresAt,
            data: { id: usuario._id, nombre: usuario.nombre, username: usuario.username, email: usuario.email, rol: usuario.rol }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al iniciar sesión', error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id)
            .populate('restauranteAsignado', 'nombre direccion')
            .select('-password -__v');

        if (!usuario || !usuario.estado) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.status(200).json({ success: true, data: usuario });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener perfil', error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.find({ estado: true })
            .populate('restauranteAsignado', 'nombre direccion')
            .select('-password -__v');

        res.status(200).json({ success: true, total: usuarios.length, usuarios });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Sin permisos para modificar este usuario', error: 'FORBIDDEN' });
        }

        if (req.user.role !== 'ADMIN') {
            ['rol', 'estado', 'restauranteAsignado'].forEach(c => delete req.body[c]);
        }

        const usuario = await Usuario.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-password -__v');

        if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

        res.status(200).json({ success: true, message: 'Usuario actualizado', data: usuario });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar', error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }).select('-password -__v');

        if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

        res.status(200).json({ success: true, message: `Usuario "${usuario.username}" desactivado`, data: usuario });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al desactivar usuario', error: error.message });
    }
};