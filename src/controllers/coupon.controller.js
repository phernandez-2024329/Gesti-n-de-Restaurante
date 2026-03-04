import Coupon from '../models/coupon.model.js';

export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json({
      success: true,
      message: 'Cupón creado exitosamente',
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear cupón', error: error.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ active: true });
    res.status(200).json({
      success: true,
      message: 'Cupones obtenidos',
      data: coupons
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener cupones', error: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Cupón no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Cupón actualizado', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar cupón', error: error.message });
  }
};


export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon || coupon.active === false) {
      return res.status(404).json({ success: false, message: 'Cupón no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Cupón obtenido', data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener cupón', error: error.message });
  }
};

export const deactivateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deactivated = await Coupon.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!deactivated) {
      return res.status(404).json({ success: false, message: 'Cupón no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Cupón desactivado', data: deactivated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al desactivar cupón', error: error.message });
  }
};
