import Restaurante from "../models/restaurantes.model.js";

/**
 * Servicio de Restaurantes
 * Contiene la lógica de negocio para operaciones CRUD de restaurantes
 */

/**
 * Crear un nuevo restaurante
 * @param {Object} datos - Datos del restaurante (nombre, dirección)
 * @param {string} usuarioId - ID del usuario propietario
 * @returns {Promise<Object>} Restaurante creado
 */
export const crearRestaurante = async (datos, usuarioId) => {
    try {
        const { nombre, direccion } = datos;

        // Validar que los campos requeridos estén presentes
        if (!nombre || !direccion) {
            throw new Error("El nombre y la dirección son obligatorios");
        }

        const restaurante = new Restaurante({
            nombre: nombre.trim(),
            direccion: direccion.trim(),
            usuario: usuarioId,
            estado: true
        });

        await restaurante.save();
        return restaurante;
    } catch (error) {
        throw new Error(`Error al crear restaurante: ${error.message}`);
    }
};

/**
 * Obtener todos los restaurantes activos
 * @returns {Promise<Array>} Lista de restaurantes
 */
export const obtenerRestaurantes = async () => {
    try {
        const restaurantes = await Restaurante.find({ estado: true })
            .populate("usuario", "nombre email");

        return restaurantes;
    } catch (error) {
        throw new Error(`Error al obtener restaurantes: ${error.message}`);
    }
};

/**
 * Obtener restaurantes por usuario
 * @param {string} usuarioId - ID del usuario
 * @returns {Promise<Array>} Lista de restaurantes del usuario
 */
export const obtenerRestaurantesPorUsuario = async (usuarioId) => {
    try {
        const restaurantes = await Restaurante.find({
            usuario: usuarioId,
            estado: true
        }).populate("usuario", "nombre email");

        return restaurantes;
    } catch (error) {
        throw new Error(`Error al obtener restaurantes del usuario: ${error.message}`);
    }
};

/**
 * Obtener un restaurante por ID
 * @param {string} id - ID del restaurante
 * @returns {Promise<Object>} Restaurante encontrado
 */
export const obtenerRestaurantePorId = async (id) => {
    try {
        const restaurante = await Restaurante.findById(id)
            .populate("usuario", "nombre email");

        if (!restaurante || !restaurante.estado) {
            throw new Error("Restaurante no encontrado");
        }

        return restaurante;
    } catch (error) {
        throw new Error(`Error al obtener restaurante: ${error.message}`);
    }
};

/**
 * Actualizar un restaurante
 * @param {string} id - ID del restaurante
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<Object>} Restaurante actualizado
 */
export const actualizarRestaurante = async (id, datos) => {
    try {
        // Validar que al menos un campo sea enviado
        if (!datos || Object.keys(datos).length === 0) {
            throw new Error("Debe proporcionar datos para actualizar");
        }

        // Evitar actualizar usuario y estado desde aquí
        const { usuario, estado, ...datosActualizables } = datos;

        const restaurante = await Restaurante.findByIdAndUpdate(
            id,
            datosActualizables,
            { new: true, runValidators: true }
        );

        if (!restaurante) {
            throw new Error("Restaurante no encontrado");
        }

        return restaurante;
    } catch (error) {
        throw new Error(`Error al actualizar restaurante: ${error.message}`);
    }
};

/**
 * Eliminar un restaurante (soft delete)
 * @param {string} id - ID del restaurante
 * @returns {Promise<Object>} Restaurante eliminado
 */
export const eliminarRestaurante = async (id) => {
    try {
        const restaurante = await Restaurante.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );

        if (!restaurante) {
            throw new Error("Restaurante no encontrado");
        }

        return restaurante;
    } catch (error) {
        throw new Error(`Error al eliminar restaurante: ${error.message}`);
    }
};

/**
 * Verificar si un usuario es propietario del restaurante
 * @param {string} restauranteId - ID del restaurante
 * @param {string} usuarioId - ID del usuario
 * @returns {Promise<boolean>} True si es propietario
 */
export const esProprietario = async (restauranteId, usuarioId) => {
    try {
        const restaurante = await Restaurante.findById(restauranteId);

        if (!restaurante) {
            return false;
        }

        return restaurante.usuario.toString() === usuarioId.toString();
    } catch (error) {
        throw new Error(`Error al verificar propietario: ${error.message}`);
    }
};

/**
 * Obtener estadísticas básicas de restaurantes
 * @returns {Promise<Object>} Estadísticas de restaurantes
 */
export const obtenerEstadisticas = async () => {
    try {
        const totalRestaurantes = await Restaurante.countDocuments({ estado: true });
        const restaurantesInactivos = await Restaurante.countDocuments({ estado: false });

        return {
            totalRestaurantes,
            restaurantesInactivos,
            total: totalRestaurantes + restaurantesInactivos
        };
    } catch (error) {
        throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
};
