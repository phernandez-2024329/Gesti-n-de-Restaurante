import Inventory from '../models/inventory.model.js';

export const createInventory = async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json({
      success: true,
      message: 'Artículo de inventario creado',
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear inventario', error: error.message });
  }
};

export const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find({ estado: true });
    res.status(200).json({
      success: true,
      message: 'Inventario obtenido',
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener inventario', error: error.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Inventory.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Artículo no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Artículo actualizado', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar inventario', error: error.message });
  }
};


export const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventory.findById(id);
    if (!item || item.estado === false) {
      return res.status(404).json({ success: false, message: 'Artículo no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Artículo obtenido', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener inventario', error: error.message });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Inventory.findByIdAndUpdate(id, { estado: false }, { new: true });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Artículo no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Artículo eliminado', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar inventario', error: error.message });
  }
};
