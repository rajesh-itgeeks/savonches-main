import Joi from "joi";
import { emailTypes } from "../../constants/enums.js";

export const templateDetailsSchema = Joi.object({
    type: Joi.string()
        .valid(
            emailTypes.QUOTE_SUBMITTED,
            emailTypes.QUOTE_ACCEPTED,
            emailTypes.QUOTE_REJECTED,
            emailTypes.QUOTE_EXPIRED,
            emailTypes.QUOTE_QUOTED,
        )
        .required(),
});
export const templatePreviewSchema = Joi.object({
    emailTemplate: Joi.string().required(),
    subject: Joi.string().required(),
});
export const defaultTemplateSchema = Joi.object({
    type: Joi.string()
        .valid(
            emailTypes.QUOTE_SUBMITTED,
            emailTypes.QUOTE_ACCEPTED,
            emailTypes.QUOTE_REJECTED,
            emailTypes.QUOTE_EXPIRED,
            emailTypes.QUOTE_QUOTED,
               
        )
        .required(),
});

export const saveSchema = Joi.object({
    enableStaffNotification: Joi.boolean().optional(),
    staffEmail: Joi.string().email().allow(null, "").optional(),
    enableCustomerNotification: Joi.boolean().optional(),
    customerSenderEmail: Joi.string().email().allow(null, "").optional(),
});
export const updateTypeSchema = Joi.object({
      type: Joi.string()
        .valid(
            emailTypes.QUOTE_SUBMITTED,
            emailTypes.QUOTE_ACCEPTED,
            emailTypes.QUOTE_REJECTED,
            emailTypes.QUOTE_EXPIRED,
            emailTypes.QUOTE_QUOTED,      
        )
        .required(),

    emailTemplate: Joi.string().required(),// Ensures emailTemplate is a required string
    subject: Joi.string().allow(null).optional(),

});