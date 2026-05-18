import { Schema, model } from 'mongoose';

const AuditSchema = new Schema({
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: { type: String },
  user: {
    id: { type: String },
    role: { type: String },
    name: { type: String }
  },
  before: Schema.Types.Mixed,
  after: Schema.Types.Mixed,
  details: { type: String }
}, { timestamps: { createdAt: 'timestamp', updatedAt: false } });

export default model('Audit', AuditSchema);
