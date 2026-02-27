import {
    createUsuarioService,
    getUsuariosService,
    getUsuarioByIdService,
    searchUsuarioService,
    updateUsuarioService,
    deleteUsuarioService
} from "../services/usuario.service.js";

export const createUsuario = async (req, res) => {
    try {
        const { name, surname, username, email, user_age, password } = req.body;

        if (!name || !surname || !username || !email || !user_age || !password) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios",
                missing: {
                    name: !name,
                    surname: !surname,
                    username: !username,
                    email: !email,
                    user_age: !user_age,
                    password: !password
                }
            });
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "El formato del correo electrónico no es válido"
            });
        }

        if (user_age < 0) {
            return res.status(400).json({
                message: "La edad no puede ser negativa"
            });
        }

        const usuario = await createUsuarioService(req.body);
        
        return res.status(201).json({
            message: "Usuario creado exitosamente",
            data: usuario
        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                message: `El ${field === 'email' ? 'correo electrónico' : 'nombre de usuario'} ya está en uso`,
                field: field
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Error de validación",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        return res.status(500).json({
            message: "Error al crear el usuario",
            error: error.message
        });
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await getUsuariosService();
        
        return res.status(200).json({
            message: "Usuarios obtenidos exitosamente",
            count: usuarios.length,
            data: usuarios
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "El ID del usuario es obligatorio"
            });
        }

        const usuario = await getUsuarioByIdService(id);

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "Usuario obtenido exitosamente",
            data: usuario
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "ID de usuario no válido"
            });
        }

        return res.status(500).json({
            message: "Error al obtener el usuario",
            error: error.message
        });
    }
};

export const searchUsuario = async (req, res) => {
    try {
        const { searchTerm } = req.query;

        if (!searchTerm) {
            return res.status(400).json({
                message: "Debe proporcionar un término de búsqueda"
            });
        }

        const usuarios = await searchUsuarioService(searchTerm);

        if (usuarios.length === 0) {
            return res.status(404).json({
                message: "No se encontraron usuarios con ese término"
            });
        }

        return res.status(200).json({
            message: "Búsqueda completada",
            count: usuarios.length,
            data: usuarios
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al buscar usuarios",
            error: error.message
        });
    }
};

export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({
                message: "El ID del usuario es obligatorio"
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No se proporcionaron datos para actualizar"
            });
        }

        if (updateData.email) {
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(updateData.email)) {
                return res.status(400).json({
                    message: "El formato del correo electrónico no es válido"
                });
            }
        }

        if (updateData.user_age !== undefined && updateData.user_age < 0) {
            return res.status(400).json({
                message: "La edad no puede ser negativa"
            });
        }

        const usuario = await updateUsuarioService(id, updateData);

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "Usuario actualizado exitosamente",
            data: usuario
        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                message: `El ${field === 'email' ? 'correo electrónico' : 'nombre de usuario'} ya está en uso`,
                field: field
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "ID de usuario no válido"
            });
        }

        return res.status(500).json({
            message: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "El ID del usuario es obligatorio"
            });
        }

        const usuario = await deleteUsuarioService(id);

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "Usuario eliminado exitosamente",
            data: usuario
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "ID de usuario no válido"
            });
        }

        return res.status(500).json({
            message: "Error al eliminar el usuario",
            error: error.message
        });
    }
};
