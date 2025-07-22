import { ErrorMessage, SuccessMessage } from '../constants/messages.js';
import { statusCode } from '../constants/statusCodes.js';
import { sendResponse } from '../utils/sendResponse.js';
import * as services from '../services/analyticService.js'

export const dashboardSummary = async (req, res) => {
    try {
        const storeId = req.currentStoreInfo?._id;

        const result = await services.dashboardSummary(storeId)
        if (!result.status) return sendResponse(res, statusCode.BAD_REQUEST, false, result?.message);
        return sendResponse(res, statusCode.OK, true, result?.message, result?.data);
    } catch (error) {
        console.log(`Error in dashboardSummary : ${error?.message}`);
        return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
