import { ErrorMessage, SuccessMessage } from '../constants/messages.js';
import { statusCode } from '../constants/statusCodes.js';
import * as services from '../services/productTypeService.js';
import { sendResponse } from '../utils/sendResponse.js';

export const productTypesList = async (req, res) => {
    try {

        const storeId = req.currentStoreInfo?._id;

        const result = await services.productTypesList(storeId);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in productTypesList : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const addType = async (req, res) => {
    try {

        const details = req.body
        const storeId = req.currentStoreInfo?._id;
        const session = res.locals?.shopify?.session || res.locals?.shopify;
        const result = await services.addType(storeId, details, session);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in addType : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const removeType = async (req, res) => {
    try {


        const id = req.params.id
        if (!id) return sendResponse(res, statusCode.BAD_REQUEST, false, "Id is required");

        const session = res.locals?.shopify?.session || res.locals?.shopify;
        const result = await services.removeType(id, session);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in removeType : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const updateType = async (req, res) => {
    try {

        const id = req.params.id
        if (!id) return sendResponse(res, statusCode.BAD_REQUEST, false, "Id is required");

        const session = res.locals?.shopify?.session || res.locals?.shopify;
        const details = req.body
        const result = await services.updateType(details, id, session);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in updateType : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
