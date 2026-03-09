import Restaurant from '../models/restaurant.model.js';
import Table from '../models/table.model.js';
import { Types } from 'mongoose';
import { uploadToCloudinary } from '../../helpers/cloudinary.js';
import fs from 'fs';

export const createRestaurant = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Borra el archivo temporal
    }

    const {
      restaurant_name,
      restaurant_type,
      restaurant_type_gastronomic,
      restaurant_direction,
      restaurant_time_start,
      restaurant_time_close,
      restaurant_mean_price,
      contact_id,
      table_id
    } = req.body || {};

    if (!restaurant_name) {
      return res.status(400).json({
        success: false,
        message: 'El campo restaurant_name es requerido'
      });
    }

    // Generar IDs aleatorios si no se proporcionan
    const finalContactId = contact_id || new Types.ObjectId();
    const finalTableId = table_id || new Types.ObjectId();

    const restaurant = new Restaurant({
      restaurant_name,
      restaurant_type,
      restaurant_type_gastronomic,
      restaurant_direction,
      restaurant_time_start,
      restaurant_time_close,
      restaurant_mean_price,
      restaurant_images: imageUrl ? [imageUrl] : [],
      contact_id: finalContactId,
      table_id: finalTableId
    });

    await restaurant.save();

    // Crear mesas por defecto automáticamente
    const defaultTables = [
      {
        table_name: 'Mesa 1',
        table_number: 1,
        table_ubication: 'Zona principal',
        table_capacity: 4,
        table_time_available: restaurant_time_start || '10:00',
        table_state: 'Disponible',
        restaurant_id: restaurant._id
      },
      {
        table_name: 'Mesa 2',
        table_number: 2,
        table_ubication: 'Zona principal',
        table_capacity: 4,
        table_time_available: restaurant_time_start || '10:00',
        table_state: 'Disponible',
        restaurant_id: restaurant._id
      },
      {
        table_name: 'Mesa 3',
        table_number: 3,
        table_ubication: 'Zona terraza',
        table_capacity: 6,
        table_time_available: restaurant_time_start || '10:00',
        table_state: 'Disponible',
        restaurant_id: restaurant._id
      }
    ];

    await Table.insertMany(defaultTables);

    res.status(201).json({
      success: true,
      message: 'Restaurante creado con imagen',
      restaurant
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear restaurante',
      error: error.message,
      stack: error.stack
    });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const filter = { estado: true };

    const restaurants = await Restaurant.find(filter)
      .populate('contact_id')
      .populate('table_id');

    res.status(200).json({
      success: true,
      total: restaurants.length,
      restaurants
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener restaurantes',
      error: error.message
    });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id)
      .populate('contact_id')
      .populate('table_id');

    if (!restaurant || !restaurant.estado) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      restaurant
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de restaurante no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener restaurante',
      error: error.message
    });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Restaurant.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Restaurante actualizado',
      restaurant: updated
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de restaurante no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar restaurante',
      error: error.message
    });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Restaurante eliminado',
      restaurant
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de restaurante no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar restaurante',
      error: error.message
    });
  }
};