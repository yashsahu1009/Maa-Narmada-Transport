import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  id: { type: String },
  date: { type: String },
  vehicleNo: { type: String, uppercase: true },
  driverName: { type: String, default: '' },
  driverPhone: { type: String, default: '' },
  routeFrom: { type: String, default: '' },
  routeTo: { type: String, default: '' },
  material: { type: String, default: '' },
  loadedWeightKg: { type: Number, default: 0 },
  emptyWeightKg: { type: Number, default: 0 },
  netWeightKg: { type: Number, default: 0 },
  weightQuintals: { type: Number, default: 0 },
  perkuntaRate: { type: Number, default: 0 },
  freightAmount: { type: Number, default: 0 }
});

const billSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  biltyNo: { type: String, required: true },
  date: { type: String, required: true },
  clientName: { type: String, required: true },
  clientPhone: { type: String, default: '' },
  clientAddress: { type: String, default: '' },
  clientGstin: { type: String, default: '' },
  trips: [tripSchema],
  vehicleNo: { type: String, default: '' },
  driverName: { type: String, default: '' },
  driverPhone: { type: String, default: '' },
  routeFrom: { type: String, default: '' },
  routeTo: { type: String, default: '' },
  material: { type: String, default: '' },
  loadedWeightKg: { type: Number, default: 0 },
  emptyWeightKg: { type: Number, default: 0 },
  netWeightKg: { type: Number, default: 0 },
  weightQuintals: { type: Number, default: 0 },
  perkuntaRate: { type: Number, default: 0 },
  freightAmount: { type: Number, default: 0 },
  loadingCharges: { type: Number, default: 0 },
  unloadingCharges: { type: Number, default: 0 },
  haltingCharges: { type: Number, default: 0 },
  tollTaxes: { type: Number, default: 0 },
  grossTotal: { type: Number, default: 0 },
  advancePaid: { type: Number, default: 0 },
  netPayable: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export const BillModel = mongoose.model('Bill', billSchema);
