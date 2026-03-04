import * as EventsModule from '../models/events.model.js';
const Events = EventsModule.default || EventsModule;

const createEvent = async (req, res) => {
  try {
    const event = new Events(req.body);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear evento',
      error: error.message
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Events.find({ estado: true });
    res.status(200).json({
      success: true,
      message: 'Eventos obtenidos exitosamente',
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos',
      error: error.message
    });
  }
};


const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Events.findById(id);
    if (!event || event.estado === false) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Evento obtenido exitosamente', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener evento', error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await Events.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Evento actualizado', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar evento', error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Events.findByIdAndUpdate(id, { estado: false }, { new: true });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Evento eliminado', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar evento', error: error.message });
  }
};

const eventsController = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};

export default eventsController;