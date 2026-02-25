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
  const events = await Events.find({ estado: true });
  res.json(events);
};

const updateEvent = async (req, res) => {
  res.json({ message: 'updateEvent' });
};

const deleteEvent = async (req, res) => {
  res.json({ message: 'deleteEvent' });
};

const eventsController = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
};

export default eventsController;