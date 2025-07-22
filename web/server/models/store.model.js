import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    shopJson: {
        type: JSON
    },
    myshopify_domain: {
        type: String
    },
},
    { 'timestamps': true }
);

export const Store = mongoose.model("store", storeSchema);
