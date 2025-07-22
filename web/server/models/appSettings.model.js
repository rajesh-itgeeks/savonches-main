import mongoose from "mongoose";

const quoteSettingsSchema = new mongoose.Schema({
  autoExpireQuote: {
    isOn: { type: Boolean, default: false },
  },
  expirationTime: {
    time: { type: String },
  },
  quoteReminderTime: {
    time: { type: String },
  }
}, { _id: false }); // prevent Mongoose from adding its own _id to the subdocument

const appSettingSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  quoteIdPrefix: {
    type: String
  },
  contactEmail: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  currency: {
    type: String
  },
  quoteSettings: {
    type: quoteSettingsSchema,
    default: {}
  }
}, {
  timestamps: true
});

export const AppSettings = mongoose.model("appSettings", appSettingSchema);
