import { dummyQuotation } from "../constants/dummyQuotation.js";
import { emailTypes } from "../constants/enums.js";
import { ErrorMessage, SuccessMessage } from "../constants/messages.js";
import { DefaultNotifications } from "../models/defaultNotification.model.js";
import { Notifications } from "../models/notification.model.js";
import { convertLiquidToHtml } from "../utils/utils.js";

export const templateDetails = async (type, storeId) => {
    try {
        let result = await Notifications.findOne({ storeId }, { [type]: 1, _id: 1, enableStaffNotification: 1, staffEmail: 1, enableCustomerNotification: 1, customerSenderEmail: 1 });
        let data = {
            _id: result._id,
            type: type,
            emailTemplate: result[type]?.emailTemplate,
            subject: result[type]?.subject,
            enableStaffNotification: result.enableStaffNotification,
            staffEmail: result.staffEmail,
            enableCustomerNotification: result.enableCustomerNotification,
            customerSenderEmail: result.customerSenderEmail
        }
        if (!result[type]?.emailTemplate || !result[type]?.subject) {
            data = await DefaultNotifications.findOne({ type }).lean();

            // add extra details for prepareEmail function if customer did not set emailTemplate and subject
            data.enableCustomerNotification = result.enableCustomerNotification
            data.customerSenderEmail = result.customerSenderEmail
            data.enableStaffNotification = result.enableStaffNotification
            data.staffEmail = result.staffEmail
        }
        return {
            status: true,
            message: `Notifications ${SuccessMessage.DATA_FETCHED}`,
            data: data,
        }
    }
    catch (error) {
        console.log("Error in templateDetails :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const templatePreview = async (details) => {
    try {
        const { emailTemplate, subject } = details
        const result = await convertLiquidToHtml(emailTemplate, subject, dummyQuotation)
        return {
            status: true,
            message: `Preview ${SuccessMessage.DATA_FETCHED}`,
            data: result,
        }
    }
    catch (error) {
        console.log("Error in templatePreview :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const defaultTemplate = async (type) => {
    try {
        const result = await DefaultNotifications.findOne({ type });
        if (!result) {
            return {
                status: false,
                message: ErrorMessage.DATA_NOT_FOUND,
            }
        }
        return {
            status: true,
            message: SuccessMessage.DATA_FETCHED,
            data: result,
        }
    } catch (error) {
        console.log("Error in defaultTemplate :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const notificationDetails = async (storeId) => {
    try {
        const excludedFields = Object.values(emailTypes).reduce((acc, type) => {
            acc[`${type}.emailTemplate`] = 0;
            acc[`${type}.subject`] = 0;
            return acc;
        }, {});
        let result = await Notifications.findOne({ storeId }, excludedFields);
        return {
            status: true,
            message: SuccessMessage.DATA_FETCHED,
            data: result,
        }
    } catch (error) {
        console.log("Error in notificationDetails :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}

export const saveSettings = async (storeId, details) => {
    try {
        const result = await Notifications.findOneAndUpdate(
            { storeId: storeId },
            details,
            { new: true, upsert: true } // This ensures the latest updated document is returned
        );
        return {
            status: true,
            message: `Notifications ${SuccessMessage.DATA_UPDATED}`,
            data: result,
        }

    } catch (error) {
        console.log("Error in saveSettings :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const updateType = async (storeId, details) => {
    try {
        const { type, emailTemplate, subject } = details;
        const result = await Notifications.findOneAndUpdate(
            { storeId },
            { $set: { [`${type}.emailTemplate`]: emailTemplate, [`${type}.subject`]: subject } }, // Updates only the emailTemplate field
            { upsert: true, new: true }
        );
        return {
            status: true,
            message: `Notifications ${SuccessMessage.DATA_UPDATED}`,
            data: result,
        }

    } catch (error) {
        console.log("Error in updateType :", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}


