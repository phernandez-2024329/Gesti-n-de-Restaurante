import { Schema, model } from 'mongoose';

const reservationSchema = new Schema(
  {
    reservation_price: {
      type: Number,
      required: [true, 'El precio de la reservación es obligatorio']
    },
    reservation_state: {
      type: String,
      required: [true, 'El estado de la reservación es obligatorio'],
      trim: true
    },
    reservation_surcharge: {
      type: Number,
      default: 0
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

export default model('Reservation', reservationSchema);