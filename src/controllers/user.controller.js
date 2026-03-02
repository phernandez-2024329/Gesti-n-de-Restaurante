// Endpoint para verificación de email
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token de verificación faltante' });
        }
        const usuario = await Usuario.findOne({ emailVerificationToken: token, emailVerificationExpires: { $gt: new Date() } });
        if (!usuario) {
            return res.status(400).json({ success: false, message: 'Token inválido o expirado' });
        }
        usuario.emailVerified = true;
        usuario.emailVerificationToken = null;
        usuario.emailVerificationExpires = null;
        await usuario.save();
        res.status(200).json({ success: true, message: 'Correo verificado correctamente. Ya puedes iniciar sesión.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al verificar correo', error: error.message });
    }
};

import Usuario from '../models/user.model.js';
import { generateJWT } from '../../helpers/generate-jwt.js';
import { Roles } from '../constants/roles.js';
import { sendMail } from '../../helpers/sendMail.js';
import crypto from 'crypto';

// Registro de usuario
export const registerUser = async (req, res) => {
    try {
        const { nombre, username, email, password, telefono, rol, rol_id } = req.body;

        // si el administrador crea el usuario, puede asignar cualquiera de los roles permitidos
        let rolAsignado = Roles.CLIENTE;
        if (req.user?.role === Roles.ADMIN) {
            rolAsignado = rol_id || rol || Roles.CLIENTE;
        }

        // Generar token de verificación
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        const usuario = new Usuario({
            nombre,
            username,
            email,
            password,
            telefono,
            rol: rolAsignado,
            rol_id: rolAsignado,
            emailVerificationToken,
            emailVerificationExpires,
            emailVerified: false
        });
        await usuario.save();

        // Enviar correo de verificación
        try {
            const verifyUrl = `http://localhost:3006/GestorRestaurante/v1/auth/verify-email?token=${emailVerificationToken}`;
            await sendMail(
                email,
                'Verifica tu correo - Gestión de Restaurantes',
                `<h2>¡Hola ${nombre || username}!</h2>
                <p>Gracias por registrarte en <b>Gestión de Restaurantes</b>.</p>
                <p>Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
                <a href="${verifyUrl}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Verificar correo</a>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p>${verifyUrl}</p>
                <p>Este enlace expirará en 24 horas.</p>`
            );
        } catch (mailError) {
            console.error('Error enviando correo de verificación:', mailError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
            data: { id: usuario._id, nombre: usuario.nombre, username: usuario.username, email: usuario.email, rol: usuario.rol, rol_id: usuario.rol_id }
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

        // emitimos rol y rol_id en el JWT para que los middlewares puedan validarlos
        const token = await generateJWT(usuario._id, { role: usuario.rol, rol_id: usuario.rol_id });
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            expiresAt,
            data: { id: usuario._id, nombre: usuario.nombre, username: usuario.username, email: usuario.email, rol: usuario.rol, rol_id: usuario.rol_id }
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

        if (req.user.role !== Roles.ADMIN) {
            ['rol', 'rol_id', 'estado', 'restauranteAsignado'].forEach(c => delete req.body[c]);
        }

        const usuario = await Usuario.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select('-password -__v');

        if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

        res.status(200).json({ success: true, message: 'Usuario actualizado', data: { ...usuario.toObject(), rol_id: usuario.rol_id } });

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