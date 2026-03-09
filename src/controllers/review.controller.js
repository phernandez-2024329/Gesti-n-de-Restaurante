import Review from '../models/review.model.js';

export const createReview = async (req, res) => {
  try {
    const { user_id, restaurant_id, rating, comment } = req.body;

    const review = new Review({
      user_id,
      restaurant_id,
      rating,
      comment: comment || undefined
    });

    await review.save();

    const populated = await Review.findById(review._id)
      .populate('user_id', 'nombre email')
      .populate('restaurant_id', 'restaurant_name restaurant_direction');

    res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
      data: populated
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario o restaurante no válido',
        error: 'INVALID_ID'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear reseña',
      error: error.message
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { restaurant_id } = req.query;
    const filter = { active: true };

    if (restaurant_id) filter.restaurant_id = restaurant_id;

    const reviews = await Review.find(filter)
      .populate('user_id', 'nombre email')
      .populate('restaurant_id', 'restaurant_name restaurant_direction')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      message: 'Reseñas obtenidas',
      total: reviews.length,
      data: reviews
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'restaurant_id inválido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener reseñas',
      error: error.message
    });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({ _id: id, active: true })
      .populate('user_id', 'nombre email')
      .populate('restaurant_id', 'restaurant_name restaurant_direction');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reseña obtenida',
      data: review
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de reseña no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener reseña',
      error: error.message
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {};
    if (req.body.rating !== undefined) updateData.rating = req.body.rating;
    if (req.body.comment !== undefined) updateData.comment = req.body.comment;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se enviaron campos válidos para actualizar (rating, comment)'
      });
    }

    const updated = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }
    if (!updated.active) {
      return res.status(404).json({
        success: false,
        message: 'Reseña desactivada'
      });
    }

    const populated = await Review.findById(updated._id)
      .populate('user_id', 'nombre email')
      .populate('restaurant_id', 'restaurant_name restaurant_direction');

    res.status(200).json({
      success: true,
      message: 'Reseña actualizada',
      data: populated
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de reseña no válido',
        error: 'INVALID_ID'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar reseña',
      error: error.message
    });
  }
};

export const deactivateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Review.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }
    if (!existing.active) {
      return res.status(404).json({
        success: false,
        message: 'Reseña ya está desactivada'
      });
    }

    const deactivated = await Review.findByIdAndUpdate(id, { active: false }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Reseña desactivada',
      data: deactivated
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de reseña no válido',
        error: 'INVALID_ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al desactivar reseña',
      error: error.message
    });
  }
};
