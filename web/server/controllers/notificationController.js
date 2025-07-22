import { ErrorMessage, SuccessMessage } from '../constants/messages.js';
import { statusCode } from '../constants/statusCodes.js';
import * as services from '../services/notificationService.js';
import { sendResponse } from '../utils/sendResponse.js';

export const templateDetails = async (req, res) => {
    try {

        const { type } = req.body
        const storeId = req.currentStoreInfo?._id;

        const result = await services.templateDetails(type, storeId);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in templateDetails : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const templatePreview = async (req, res) => {
    try {
        const details = req.body
        const result = await services.templatePreview(details);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);

        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in templatePreview : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const defaultTemplate = async (req, res) => {
    try {
        const { type } = req.body
        console.log(type)
        const result = await services.defaultTemplate(type);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in defaultTemplate : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const notificationDetails = async (req, res) => {
    try {
        const storeId = req.currentStoreInfo?._id;
        const result = await services.notificationDetails(storeId);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in notificationDetails : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const saveSettings = async (req, res) => {
    try {
        const details = req.body
        const storeId = req.currentStoreInfo?._id;
        const result = await services.saveSettings(storeId, details);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in saveSettings : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const updateType = async (req, res) => {
    try {
        const details = req.body
        const storeId = req.currentStoreInfo?._id;
        const result = await services.updateType(storeId, details);

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in updateType : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}

