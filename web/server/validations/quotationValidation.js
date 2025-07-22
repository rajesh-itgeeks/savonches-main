import { quotationListSchema, quotationSchema, adminUpdateQuotationSchema,customerUpdateQuotationSchema, customerQuotationListSchema } from "./schema/quotationSchema.js"
import { statusCode } from "../constants/statusCodes.js";

export const quotationValidation = async (req, res, next) => {
    const { error } = quotationSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};
export const customerQuotationListValidation = async (req, res, next) => {
    const { error } = customerQuotationListSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};

export const adminUpdateValidation = async (req, res, next) => {
    const { error } = adminUpdateQuotationSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};
export const customerUpdateValidation = async (req, res, next) => {
    const { error } = customerUpdateQuotationSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};
export const listValidation = async (req, res, next) => {
    const { error } = quotationListSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};


