import mongoose from "mongoose";

const shopifySessionsSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  shop: {
    type: String,
  },
  state: {
    type: Number,
  },
  isOnline: {
    type: Boolean,
  },
  accessToken: {
    type: String,
  },
}, {
  timestamps: true,
});

export const ShopifySessions = mongoose.model("shopify_sessions", shopifySessionsSchema);

