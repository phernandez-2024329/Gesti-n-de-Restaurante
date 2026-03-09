import Review from '../models/review.model.js';

export const createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear reseña', error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { restaurant_id } = req.query;
    const filter = { active: true };
    if (restaurant_id) filter.restaurant_id = restaurant_id;
    const reviews = await Review.find(filter).populate({ path: 'user_id', select: 'nombre', model: 'Usuario' }).populate('restaurant_id', 'name');
    res.status(200).json({
      success: true,
      message: 'Reseñas obtenidas',
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener reseñas', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Review.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Reseña actualizada', data: updated });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID de reseña no válido', error: 'INVALID_ID' });
    }
    res.status(500).json({ success: false, message: 'Error al actualizar reseña', error: error.message });
  }
};

export const deactivateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deactivated = await Review.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!deactivated) {
      return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Reseña desactivada', data: deactivated });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID de reseña no válido', error: 'INVALID_ID' });
    }
    res.status(500).json({ success: false, message: 'Error al desactivar reseña', error: error.message });
  }
};
