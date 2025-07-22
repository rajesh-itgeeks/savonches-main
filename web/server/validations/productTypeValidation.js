import { statusCode } from "../constants/statusCodes.js";
import { addTypeSchema, updateProductTypeSchema } from "./schema/productTypeSchema.js";

export const addTypeValidation = async (req, res, next) => {
    const { error } = addTypeSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};

export const updateProductTypeValidation = async (req, res, next) => {
    const { error } = updateProductTypeSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};


