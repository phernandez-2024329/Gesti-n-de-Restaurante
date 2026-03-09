
import { Schema, model } from 'mongoose';

const MenuSchema = new Schema({
  Menu_id: { type: Number, required: true, unique: true },
  Menu_Plate: { type: String, required: true },
  Menu_Price: { type: Number, required: true },
  Menu_Drink: { type: String, required: true },
  Menu_type_plate: { type: String, required: true, enum: ['Entrada', 'Plato_fuerte', 'Postre', 'Bebida'] },
  Menu_type_drink: { type: String, required: true, enum: ['Cerveza', 'Vinos', 'Licores', 'Cocteles', 'shots', 'Bebidas_sin_alcohol', 'Bebidas_calientes'] },
  Menu_Promotion: { type: String, enum: ['Promoción_Familiar', 'Promoción_de_Quincena', 'Promoción_de_Cliente_frecuente', 'Promoción_de_Temporada', 'Promoción_de_Aniversario'] },
  Menu_description_plate: { type: String, required: true },
  Menu_ingredients: { type: [String], default: [] },
  Menu_available: { type: Boolean, default: true },
  Restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }
});

export default model('Menu', MenuSchema);