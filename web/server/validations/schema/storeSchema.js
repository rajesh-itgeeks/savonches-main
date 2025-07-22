import Joi from "joi";

const quoteSettingsSchema = Joi.object({
    autoExpireQuote: Joi.object({
        isOn: Joi.boolean().required()
    }).required(),
    expirationTime: Joi.object({
        time: Joi.string().required()
    }).required(),
    quoteReminderTime: Joi.object({
        time: Joi.string().required()
    }).required()
});

export const appSettingsUpdateSchema = Joi.object({
    businessName: Joi.string().optional(),
    quoteIdPrefix: Joi.string().optional(),
    contactEmail: Joi.string().email().optional(),
    phoneNumber: Joi.string().allow(null, "").optional(),
    currency: Joi.string().optional(),
    quoteSettings: quoteSettingsSchema.optional()
});