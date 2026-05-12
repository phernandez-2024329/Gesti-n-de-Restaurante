import { Schema, model } from 'mongoose';

const DishSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre del platillo es obligatorio'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'La descripción del platillo es obligatoria']
  },
  type: { 
    type: String, 
    required: [true, 'El tipo de platillo es obligatorio'],
    enum: ['Entrada', 'Plato_fuerte', 'Postre', 'Acompañamiento']
  },
  price: { 
    type: Number, 
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  image: { 
    type: String, 
    default: null 
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  restaurant_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: [true, 'El ID del restaurante es obligatorio']
  },
  estado: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default model('Dish', DishSchema);
