import { Schema, model } from 'mongoose';

const eventsSchema = new Schema(
  {
    events_name: {
      type: String,
      required: [true, 'El nombre del evento es obligatorio'],
      trim: true,
      minlength: [3, 'Mínimo 3 caracteres']
    },
    events_type: {
      type: String,
      required: [true, 'El tipo de evento es obligatorio'],
      trim: true
    },
    events_date_time_start: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria']
    },
    events_date_time_finish: {
      type: Date,
      required: [true, 'La fecha de finalización es obligatoria']
    },
    events_tematic: {
      type: String,
      required: [true, 'La temática es obligatoria'],
      trim: true
    },
    events_history: {
      type: String,
      trim: true
    },
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurante',
      required: [true, 'El restaurante es obligatorio']
    },
    estado: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Validación lógica: fecha fin > fecha inicio
eventsSchema.pre('save', function (next) {
  if (this.events_date_time_finish <= this.events_date_time_start) {
    return next(new Error('La fecha de finalización debe ser mayor que la de inicio'));
  }
  next();
});

export default model('Events', eventsSchema);