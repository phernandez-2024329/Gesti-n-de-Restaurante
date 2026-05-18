import { Schema, model } from 'mongoose';

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discount_type: { type: String, enum: ['percentage', 'amount'], required: true },
  discount_value: { type: Number, required: true },
  max_uses: { type: Number, required: true },
  max_uses_per_user: { type: Number, required: true },
  expiration_date: { type: Date, required: true },
  min_order_amount: { type: Number },
  restaurant_ids: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
  active: { type: Boolean, default: true },
  current_uses: { type: Number, default: 0 },
  redemptions: [{
    order: { type: Schema.Types.ObjectId, ref: 'Orders' },
    user: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    amount_applied: { type: Number },
    applied_at: { type: Date, default: Date.now }
  }]
});

export default model('Coupon', couponSchema);
