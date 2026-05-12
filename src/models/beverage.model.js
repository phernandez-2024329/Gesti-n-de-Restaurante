import { Schema, model } from 'mongoose';

const BeverageSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre de la bebida es obligatorio'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'La descripción de la bebida es obligatoria']
  },
  type: { 
    type: String, 
    required: [true, 'El tipo de bebida es obligatorio'],
    enum: ['Cerveza', 'Vinos', 'Licores', 'Cocteles', 'Shots', 'Bebidas_sin_alcohol', 'Bebidas_calientes']
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

export default model('Beverage', BeverageSchema);
