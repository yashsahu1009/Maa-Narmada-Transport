import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  gstin: { type: String, default: '' },
  contactPerson: { type: String, default: '' }
}, {
  timestamps: true
});

export const ClientModel = mongoose.model('Client', clientSchema);
