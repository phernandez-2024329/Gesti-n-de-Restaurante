import { Schema, model } from 'mongoose';

const restaurantSchema = new Schema(
  {
    restaurant_name: {
      type: String,
      required: [true, 'El nombre del restaurante es obligatorio'],
      trim: true
    },
    restaurant_type: {
      type: String,
      required: [true, 'El tipo de restaurante es obligatorio'],
      trim: true
    },
    restaurant_type_gastronomic: {
      type: String,
      required: [true, 'El tipo gastronómico es obligatorio'],
      trim: true
    },
    restaurant_direction: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
      trim: true
    },
    restaurant_time_start: {
      type: String,
      required: [true, 'La hora de apertura es obligatoria']
    },
    restaurant_time_close: {
      type: String,
      required: [true, 'La hora de cierre es obligatoria']
    },
    restaurant_mean_price: {
      type: Number,
      required: [true, 'El precio promedio es obligatorio'],
      min: 0
    },
    restaurant_images: {
      type: [String],
      default: []
    },
    contact_id: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: [true, 'El id del contacto es obligatorio']
    },
    table_id: {
      type: Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'El id de la mesa es obligatorio']
    },
    estado: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default model('Restaurant', restaurantSchema);