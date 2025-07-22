import { ErrorMessage, SuccessMessage } from '../constants/messages.js';
import { statusCode } from '../constants/statusCodes.js';
import * as services from '../services/quotationService.js';
import { sendResponse } from '../utils/sendResponse.js';
import { uploadImages } from '../utils/uploadFile.js';

export const submitQuote = async (req, res) => {
    try {
        const details = req.body
        const session = res.locals?.shopify?.session || res.locals?.shopify
        const storeId = req.currentStoreInfo?._id;

        const result = await services.submitQuote(details, storeId, req.files, session)

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_CREATED, result?.data);
    } catch (error) {
        console.log("Error in submitQuote api:", error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const adminUpdateQuote = async (req, res) => {
    try {
        const id = req.params.id
        const details = req.body
        const storeId = req.currentStoreInfo?._id;
        const result = await services.adminUpdateQuote(details, id, storeId)

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_UPDATED, result?.data);
    } catch (error) {
        console.log("Error in adminUpdateQuote api:", error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}

export const customerUpdateQuote = async (req, res) => {
    try {
        const details = req.body
        const storeId = req.currentStoreInfo?._id;
        const result = await services.customerUpdateQuote(details, storeId)

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_UPDATED, result?.data);
    } catch (error) {
        console.log("Error in customerUpdateQuote api:", error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const productTypesList = async (req, res) => {
    try {
        const storeId = req.currentStoreInfo?._id;
        const result = await services.productTypesList(storeId)

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, result?.data);
    } catch (error) {
        console.log("Error in customerUpdateQuote api:", error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const quotationList = async (req, res) => {
    try {

        const details = req.body
        const storeId = req.currentStoreInfo?._id;
        const result = await services.quotationList(details, storeId)

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, result.message, result?.data);
    } catch (error) {
        console.log("Error in quotationList api:", error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const allCustomerQuotations = async (req, res) => {
    try {

        const details = req.body
        const result = await services.allCustomerQuotations(details)

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, result.message, result?.data);
    } catch (error) {
        console.log("Error in allCustomerQuotations api:", error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
export const getQuoteById = async (req, res) => {
    try {

        const id = req.params.id
        const result = await services.getQuoteById(id)

        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, result.message, result?.data);
    } catch (error) {
        console.log("Error in getQuoteById api:", error)
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
