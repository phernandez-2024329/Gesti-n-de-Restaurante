import { Schema, model } from 'mongoose';

const inventorySchema = new Schema({
  item_name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  provider: { type: String, required: true },
  restaurant_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: [true, 'El ID del restaurante es obligatorio']
  },
  estado: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Inventory', inventorySchema);
