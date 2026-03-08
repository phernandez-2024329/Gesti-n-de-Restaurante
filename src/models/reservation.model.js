import { Schema, model } from 'mongoose';

const reservationSchema = new Schema(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'El restaurante es obligatorio']
    },
    table_id: {
      type: Schema.Types.ObjectId,
      ref: 'Table',
      default: null
    },
    reservation_type: {
      type: String,
      enum: ['mesa', 'domicilio', 'para_llevar'],
      required: [true, 'El tipo de reservación es obligatorio']
    },
    reservation_date: {
      type: Date,
      required: [true, 'La fecha de la reservación es obligatoria']
    },
    reservation_time: {
      type: String,
      required: [true, 'La hora de la reservación es obligatoria'],
      trim: true
    },
    reservation_price: {
      type: Number,
      required: [true, 'El precio de la reservación es obligatorio'],
      min: 0
    },
    reservation_state: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
      default: 'pendiente',
      trim: true
    },
    reservation_surcharge: {
      type: Number,
      default: 0,
      min: 0
    },
    reservation_history: {
      type: String,
      trim: true,
      default: ''
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio']
    },
    estado: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

reservationSchema.index({ restaurant_id: 1, table_id: 1, reservation_date: 1, reservation_time: 1 });
reservationSchema.index({ user_id: 1, restaurant_id: 1, reservation_date: 1, reservation_time: 1 });

export default model('Reservation', reservationSchema);