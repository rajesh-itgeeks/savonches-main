import { metafieldKeys } from "../constants/enums.js";
import { ErrorMessage, SuccessMessage } from "../constants/messages.js";
import { ProductTypes } from "../models/productTypes.model.js";
import { updatePageMetafield } from "../utils/utils.js";

export const productTypesList = async (storeId) => {
    try {
        const data = await ProductTypes.find({ storeId }).lean().sort({ createdAt: -1 });
        return {
            status: true,
            message: `Product Types ${SuccessMessage.DATA_FETCHED}`,
            data: data,
        }
    }
    catch (error) {
        console.log("Error in productTypesList :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const addType = async (storeId, details, session) => {
    try {
        const data = await ProductTypes.create({ ...details, storeId });
        updatePageMetafield(session, metafieldKeys.PRODUCT_TYPES)
        return {
            status: true,
            message: `ProductTypes ${SuccessMessage.DATA_CREATED}`,
            data: data,
        }
    }
    catch (error) {
        console.log("Error in addType :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const removeType = async (id, session) => {
    try {
        const data = await ProductTypes.deleteOne({ _id: id });
        updatePageMetafield(session, metafieldKeys.PRODUCT_TYPES)
        return {
            status: true,
            message: `ProductTypes ${SuccessMessage.DATA_DELETED}`,
            data: data,
        }
    }
    catch (error) {
        console.log("Error in removeType :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}



export const updateType = async (details, id, session) => {
    try {
        console.log("details", details);
        console.log("details", id);
        const data = await ProductTypes.findByIdAndUpdate(id, { $set: details });
        updatePageMetafield(session, metafieldKeys.PRODUCT_TYPES)
        return {
            status: true,
            message: `ProductTypes ${SuccessMessage.DATA_UPDATED}`,
            data: data,
        }
    }
    catch (error) {
        console.log("Error in updateType :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}

