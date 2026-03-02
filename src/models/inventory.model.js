import { Schema, model } from 'mongoose';

const inventorySchema = new Schema({
  item_name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  provider: { type: String, required: true },
  estado: { type: Boolean, default: true }
});

export default model('Inventory', inventorySchema);
