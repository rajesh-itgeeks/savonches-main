import Joi from "joi";

export const addTypeSchema = Joi.object({
    typeName: Joi.string().required(),
    typeImages: Joi.array().items(Joi.object({
        label: Joi.string().required(),
        isRequired: Joi.boolean().required()
    })).min(1).required()
});
export const updateProductTypeSchema = Joi.object({
    typeName: Joi.string().required(),
    typeImages: Joi.array().items(Joi.object({
        label: Joi.string().required(),
        isRequired: Joi.boolean().required()
    })).min(1).required()
});
