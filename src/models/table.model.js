import { Schema, model } from 'mongoose';

const tableSchema = new Schema(
  {
    table_name: {
      type: String,
      required: [true, 'El nombre de la mesa es obligatorio'],
      trim: true
    },
    table_number: {
      type: Number,
      required: [true, 'El número de la mesa es obligatorio']
    },
    table_ubication: {
      type: String,
      required: [true, 'La ubicación de la mesa es obligatoria'],
      trim: true
    },
    table_capacity: {
      type: Number,
      required: [true, 'La capacidad de la mesa es obligatoria'],
      min: 1
    },
    table_time_available: {
      type: String,
      trim: true
    },
    table_state: {
      type: String,
      enum: ['Disponible', 'Ocupada', 'Reservada'],
      default: 'Disponible'
    },
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurante',
      required: [true, 'El id del restaurante es obligatorio']
    },
    reserva_id: {
      type: Schema.Types.ObjectId,
      ref: 'Reservation',
      default: null
    },
    estado: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default model('Table', tableSchema);