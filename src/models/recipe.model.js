import { Schema, model } from 'mongoose';

const RecipeSchema = new Schema({
  dish_id: {
    type: Schema.Types.ObjectId,
    ref: 'Dish',
    default: null
  },
  beverage_id: {
    type: Schema.Types.ObjectId,
    ref: 'Beverage',
    default: null
  },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'El ID del restaurante es obligatorio']
  },
  ingredients: [{
    inventory_id: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
      required: [true, 'El ID del inventario es obligatorio']
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [0.01, 'La cantidad debe ser mayor a 0']
    },
    unit: {
      type: String,
      required: [true, 'La unidad es obligatoria'],
      enum: ['kg', 'g', 'L', 'ml', 'unidades', 'docena', 'paquete', 'lata', 'caja']
    }
  }],
  description: {
    type: String,
    default: null
  },
  preparation_time: {
    type: Number,
    default: 0,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['Fácil', 'Medio', 'Difícil'],
    default: 'Medio'
  },
  estado: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Validación: al menos dish_id o beverage_id debe estar presente
RecipeSchema.pre('save', function() {
  if (!this.dish_id && !this.beverage_id) {
    throw new Error('Debe proporcionar al menos un dish_id o beverage_id');
  }
});

export default model('Recipe', RecipeSchema);
