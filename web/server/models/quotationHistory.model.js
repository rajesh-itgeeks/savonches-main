import mongoose from "mongoose";

const quoteHistorySchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    quoteId: {
        type: String,
    },
    customerGid: {
        type: String
    },
    actionType: {
        type: String
    },
    quotedOffer: {
        type: Number
    }
},
    { 'timestamps': true }

);

export const QuotationHistory = mongoose.model("quotationHistory", quoteHistorySchema);
