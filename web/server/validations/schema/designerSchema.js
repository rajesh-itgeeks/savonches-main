import Joi from "joi";

export const addDesignerSchema = Joi.object({
    designerName: Joi.string().required(),
});
export const updateDesignerSchema = Joi.object({
    designerName: Joi.string().required(),
});
