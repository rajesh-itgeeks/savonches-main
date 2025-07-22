import mongoose from "mongoose";

const TypeSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    typeName: {
        type: String,
        required: true,
        unique: true
    },
    typeImages: [
        {
            _id: false,
            label: {
                type: String,
            },
            isRequired: {
                type: Boolean,
                default: false
            },
        }
    ],
}, {
    timestamps: true
});

export const ProductTypes = mongoose.model("ProductTypes", TypeSchema);
