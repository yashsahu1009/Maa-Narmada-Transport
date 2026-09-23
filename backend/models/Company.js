import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    tagline: {
      type: String,
      default: ''
    },

    proprietor: {
      type: String,
      default: ''
    },

    phone: {
      type: String,
      default: ''
    },

    email: {
      type: String,
      default: ''
    },

    address: {
      type: String,
      default: ''
    },

    gstin: {
      type: String,
      default: ''
    },

    pan: {
      type: String,
      default: ''
    },

    bankDetails: {
      bankName: {
        type: String,
        default: ''
      },

      accountName: {
        type: String,
        default: ''
      },

      accountNo: {
        type: String,
        default: ''
      },

      ifsc: {
        type: String,
        default: ''
      },

      branch: {
        type: String,
        default: ''
      }
    }
  },
  {
    timestamps: true
  }
);

const CompanyModel = mongoose.model(
  'Company',
  companySchema
);

export { CompanyModel };