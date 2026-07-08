import { Schema, model } from 'mongoose';

const RefreshTokenSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true, index: true },
  userId:    { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  familyId:  { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date, default: null },
}, { timestamps: true });

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model('RefreshToken', RefreshTokenSchema);
