// utils/responseHandler.js

export function sendResponse(res, statusCode, status, message, result) {
    res.status(statusCode).json({ status, message, result });
}
