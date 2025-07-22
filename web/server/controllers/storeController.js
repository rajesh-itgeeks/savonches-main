import { ErrorMessage, SuccessMessage } from '../constants/messages.js';
import { statusCode } from '../constants/statusCodes.js';
import * as services from '../services/storeService.js';
import { sendResponse } from '../utils/sendResponse.js';

export const storeInfo = async (req, res) => {
    try {
        // get session 
        const session = res.locals.shopify.session || res.locals.shopify;
        // partner details 
        const result = await services.storeInfo(session);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in storeInfo : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const getStoreSettings = async (req, res) => {
    try {
        // get session 
        const storeId = req.currentStoreInfo?._id;
        // setting details 
        const result = await services.getStoreSettings(storeId);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in getStoreSettings : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const updateStoreSettings = async (req, res) => {
    try {
        //get store id
        const storeId = req.currentStoreInfo?._id;
        const details = req.body;
        // setting details 
        const result = await services.updateStoreSettings(storeId, details);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in updateStoreSettings : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}


