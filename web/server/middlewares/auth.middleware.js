import shopify from "../../shopify.js";
import { ErrorMessage } from "../constants/messages.js";
import { statusCode } from "../constants/statusCodes.js";
import * as partnerServices from '../services/storeService.js';
import { sendResponse } from "../utils/sendResponse.js";


export const authenticateUser = async (req, res, next) => {
    try {
        console.log('Request path --------->', req.path);
        console.log('Full URL ------------->', req.originalUrl);
        // check first api/ route session exist or not 
        const session = res.locals?.shopify?.session
        // Extract the 'shop' parameter from the request query parameters.
        let shop = req?.query?.shop || session?.shop;
        let storeName = await shopify.config.sessionStorage.findSessionsByShop(shop);

        if (!shop) {
            return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.SHOP_UNAVAILABLE);
        }
        if (storeName?.length) {
            if (shop === storeName[0].shop) {
                res.locals.shopify = { session: storeName[0] };
                req.currentShop = storeName[0].shop;
                req.currentAccessToken = storeName[0].accessToken;
                // // set current partner info
                req.currentStoreInfo = await partnerServices.getPartnerInfo(shop);
                next();
            } else {
                return sendResponse(res, statusCode.BAD_REQUEST, ErrorMessage.NOT_AUTHORIZED);
            }
        } else {
            return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.SHOP_INVALID);
        }
    } catch (error) {
        console.log("Error in authenticateUser middleware:", error);
        return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.INTERNAL_SERVER_ERROR);

    }

};