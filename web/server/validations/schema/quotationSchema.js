import Joi from "joi";
import { quoteStatus } from "../../constants/enums.js";

const customerIdPattern = /^gid:\/\/shopify\/Customer\/\d+$/;

export const quotationSchema = Joi.object({
    designer: Joi.string().required(),
    productType: Joi.string().required(),
    productName: Joi.string().required(),
    customerGid: Joi.string().pattern(customerIdPattern).required(),
    customerName: Joi.string().required(),
    customerEmail: Joi.string().email().required(),
    productDetails: Joi.string().max(1000).required(),
});
export const customerQuotationListSchema = Joi.object({
    customerGid: Joi.string().pattern(customerIdPattern).required(),
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    status: Joi.array()
        .items(Joi.string().valid(...Object.values(quoteStatus)))
        .optional(),
    search: Joi.string().allow(null, "").optional(),
    // dateFrom: Joi.date().optional(),
    // dateTo: Joi.date().optional()
    //for pagination other things are required
});

// only for admin 
export const adminUpdateQuotationSchema = Joi.object({
    quotedOffer: Joi.number().required(),
    customerGid: Joi.string().required(),
    quoteId: Joi.string().required(),
    expirationDate: Joi.date().required(),
    timeline: Joi.object().required(),
});
//only for customers
export const customerUpdateQuotationSchema = Joi.object({
    id: Joi.string().required(), //document object id
    quoteId: Joi.string().required(),
    timeline: Joi.object().optional(),
    quoteStatus: Joi.string().valid(
        quoteStatus.ACCEPTED,
        quoteStatus.REJECTED,
    ).optional(),
});
export const quotationListSchema = Joi.object({
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    status: Joi.array()
        .items(Joi.string().valid(...Object.values(quoteStatus)))
        .optional(),
    search: Joi.string().allow(null, "").optional(),
    dateFrom: Joi.date().optional(),
    dateTo: Joi.date().optional()
});

