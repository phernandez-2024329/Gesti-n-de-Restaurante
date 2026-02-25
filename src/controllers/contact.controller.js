import Contact from '../models/contact.model.js';

export const createContact = async (req, res) => {
  try {
    const {
      contact_type,
      contact_name,
      contact_position,
      contact_phone_number,
      contact_email
    } = req.body;

    const contact = new Contact({
      contact_type,
      contact_name,
      contact_position,
      contact_phone_number,
      contact_email
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contacto creado',
      contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear contacto',
      error: error.message
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const filter = { estado: true };

    const contacts = await Contact.find(filter);

    res.status(200).json({
      success: true,
      total: contacts.length,
      contacts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener contactos',
      error: error.message
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact || !contact.estado) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener contacto',
      error: error.message
    });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contacto actualizado',
      contact: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar contacto',
      error: error.message
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contacto eliminado',
      contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar contacto',
      error: error.message
    });
  }
};