import mongoose from "mongoose";
import { paymentStatus, paymentTypes, quoteStatus } from "../constants/enums.js";

const quotationSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    quoteId: {
        type: String,
        required: true,
        unique: true
    },
    customerGid: {
        type: String
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    designer: {
        type: String,
    },
    productName: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        required: true
    },
    productDetails: {
        type: String
    },
    quotedOffer: {
        type: Number
    },
    timeline: {
        submittedDate: {
            type: Date,
        },
        quotedDate: {
            type: Date
        },
        expiryDate: {
            type: Date
        },
        acceptedDate: {
            type: Date
        },
        rejected: {
            reason: { type: String },
            date: { type: Date }
        }
    },
    images: [{
        _id: false,
        frameKey: { type: String },
        name: { type: String },
        url: { type: String }
    }],
    paymentStatus: {
        type: String,
        enum: [...Object.values(paymentStatus)],
        default: 'pending'
    },
    paymentType: {
        type: String,
        enum: [...Object.values(paymentTypes)],
        default: 'none'
    },
    quoteStatus: {
        type: String,
        enum: [...Object.values(quoteStatus)],
    },
    contactData: {
        type: JSON,
        default: {}
    },
    shippingData: {
        type: JSON,
        default: {}
    },
    payoutData: {
        type: JSON,
        default: {}
    },
    expirationDate: {
        type: Date
    },  

}, {
    timestamps: true
});

export const Quotation = mongoose.model("Quotation", quotationSchema);
