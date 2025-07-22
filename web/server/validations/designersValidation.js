import { statusCode } from "../constants/statusCodes.js";
import { addDesignerSchema, updateDesignerSchema } from "./schema/designerSchema.js";

export const addDesignerValidation = async (req, res, next) => {
    const { error } = addDesignerSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};

export const updateDesignerValidation = async (req, res, next) => {
    const { error } = updateDesignerSchema.validate(req.body);
    if (error) {
        res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    } else {
        next();
    }
};


