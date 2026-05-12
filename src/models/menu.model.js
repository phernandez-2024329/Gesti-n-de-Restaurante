
import { Schema, model } from 'mongoose';

const MenuSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre del menú es obligatorio'],
    trim: true
  },
  description: { 
    type: String, 
    default: null 
  },
  dishes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Dish'
  }],
  beverages: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Beverage'
  }],
  promotion: { 
    type: String, 
    enum: ['Promoción_Familiar', 'Promoción_de_Quincena', 'Promoción_de_Cliente_frecuente', 'Promoción_de_Temporada', 'Promoción_de_Aniversario', null],
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

export default model('Menu', MenuSchema);