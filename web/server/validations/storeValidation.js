import { statusCode } from "../constants/statusCodes.js";
import { appSettingsUpdateSchema } from "./schema/storeSchema.js";

export const updateAppSettingsValidation = async (req, res, next) => {
    const { error } = appSettingsUpdateSchema.validate(req.body);
    if (error) {
        return res.status(statusCode.BAD_REQUEST).json({ error: error.details[0].message });
    }
    next();
};
