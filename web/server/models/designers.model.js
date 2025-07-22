import mongoose from "mongoose";

const designerSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    designerName: {
        type: String,
        required: true,
        unique:true
    },
}, {
    timestamps: true
});

export const Designers = mongoose.model("Designers", designerSchema);
