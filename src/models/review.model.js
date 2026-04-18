import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
  created_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

export default model('Review', reviewSchema);
