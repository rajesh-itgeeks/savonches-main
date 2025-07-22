import { metafieldKeys } from "../constants/enums.js";
import { ErrorMessage, SuccessMessage } from "../constants/messages.js";
import { Designers } from "../models/designers.model.js";
import { updatePageMetafield } from "../utils/utils.js";

export const designersList = async (storeId) => {
    try {
        const data = await Designers.find({ storeId }).lean().sort({ createdAt: -1 });
        return {
            status: true,
            message: `Designers ${SuccessMessage.DATA_FETCHED}`,
            data: data,
        }
    }
    catch (error) {
        console.log("Error in designersList :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}

export const addDesigner = async (storeId, details, session) => {
    try {
        const data = await Designers.create({ ...details, storeId });
        updatePageMetafield(session, metafieldKeys.DESIGNERS)
        return {
            status: true,
            message: `Designers ${SuccessMessage.DATA_CREATED}`,
            data: data,
        }
    }
    catch (error) {
        console.log("Error in addDesigner :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const deleteDesigner = async (id, session) => {
    try {
        const data = await Designers.deleteOne({ _id: id })
        updatePageMetafield(session, metafieldKeys.DESIGNERS)
        return {
            status: true,
            message: `Designers ${SuccessMessage.DATA_DELETED}`,
            data: data,
        }
    }
    catch (error) {
        console.log("Error in deleteDesigner :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const updateDesigner = async (id, details, session) => {
    try {
        const data = await Designers.updateOne({ _id: id }, { $set: details });
        updatePageMetafield(session, metafieldKeys.DESIGNERS)
        return {
            status: true,
            message: `Designers ${SuccessMessage.DATA_UPDATED}`,
            data: data,
        }
    }
    catch (error) {
        console.log("Error in updateDesigner :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
