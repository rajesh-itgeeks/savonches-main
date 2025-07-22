import { ErrorMessage, SuccessMessage } from '../constants/messages.js';
import { statusCode } from '../constants/statusCodes.js';
import * as services from '../services/designerService.js';
import { sendResponse } from '../utils/sendResponse.js';

export const designersList = async (req, res) => {
    try {

        const storeId = req.currentStoreInfo?._id;

        const result = await services.designersList(storeId);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in designersList : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}

export const addDesigner = async (req, res) => {
    try {

        const storeId = req.currentStoreInfo?._id;
        const details = req.body;
        const session = res.locals?.shopify?.session || res.locals?.shopify;
        const result = await services.addDesigner(storeId, details, session);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in addDesigner : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const deleteDesigner = async (req, res) => {
    try {

        const id = req.params.id
        const session = res.locals?.shopify?.session || res.locals?.shopify;
        const result = await services.deleteDesigner(id, session);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in deleteDesigner : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const updateDesigner = async (req, res) => {
    try {

        const id = req.params.id
        const session = res.locals?.shopify?.session || res.locals?.shopify;
        const details = req.body
        const result = await services.updateDesigner(id, details, session);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in updateDesigner : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
