import { statusCode } from "../constants/statusCodes.js";
import { defaultTemplateSchema, saveSchema, templateDetailsSchema, templatePreviewSchema, updateTypeSchema } from "./schema/notificationSchema.js";

export const templateDetailsValidation = async (req, res, next) => {
    const { error } = templateDetailsSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};
export const templatePreviewValidation = async (req, res, next) => {
    const { error } = templatePreviewSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};
export const defaultTemplateValidation = async (req, res, next) => {
    const { error } = defaultTemplateSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};
export const saveValidation = async (req, res, next) => {
    const { error } = saveSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};
export const updateTypeValidation = async (req, res, next) => {
    const { error } = updateTypeSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};



