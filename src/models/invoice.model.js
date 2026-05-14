import { Schema, model } from 'mongoose';

const InvoiceSchema = new Schema({
  invoice_number: {
    type: String,
    required: [true, 'El número de factura es obligatorio'],
    unique: true
  },

  invoice_description: {
    type: String,
    required: [true, 'La descripción de la factura es obligatoria']
  },

  orders_id: {
    type: Schema.Types.ObjectId,
    ref: 'Orders',
    required: [true, 'El ID de la orden es obligatorio']
  },

  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'El ID del restaurante es obligatorio']
  },

  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El ID del usuario es obligatorio']
  },

  subtotal: {
    type: Number,
    required: true,
    min: 0
  },

  tax: {
    type: Number,
    default: 0,
    min: 0
  },

  discount: {
    type: Number,
    default: 0,
    min: 0
  },

  total: {
    type: Number,
    required: true,
    min: 0
  },

  status: {
    type: String,
    enum: ['emitida', 'pagada', 'cancelada', 'pendiente'],
    default: 'pendiente'
  },

  estado: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default model('Invoice', InvoiceSchema);
