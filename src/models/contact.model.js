import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    contact_type: {
      type: String,
      required: [true, 'El tipo de contacto es obligatorio'],
      trim: true
    },
    contact_name: {
      type: String,
      required: [true, 'El nombre del contacto es obligatorio'],
      trim: true
    },
    contact_position: {
      type: String,
      required: [true, 'El cargo del contacto es obligatorio'],
      trim: true
    },
    contact_phone_number: {
      type: String,
      required: [true, 'El número de teléfono es obligatorio'],
      trim: true
    },
    contact_email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true,
      lowercase: true
    },
    estado: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default model('Contact', contactSchema);