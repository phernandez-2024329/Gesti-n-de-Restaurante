import { Schema, model } from 'mongoose';

const ReportSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['análisis', 'demanda', 'ingresos', 'ocupación', 'custom'], default: 'custom' },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  period: { type: String },
  query: { type: Schema.Types.Mixed },
  owner: {
    id: { type: String },
    role: { type: String },
    name: { type: String },
    username: { type: String }
  },
  shared: { type: Boolean, default: false }
}, { timestamps: true });

export default model('Report', ReportSchema);
