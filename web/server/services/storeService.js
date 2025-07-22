import shopify from "../../shopify.js";
import { ErrorMessage, SuccessMessage } from "../constants/messages.js";
import { AppSettings } from "../models/appSettings.model.js";
import { Notifications } from "../models/notification.model.js";
import { Store } from "../models/store.model.js";

export const storeInfo = async (session) => {
    console.log("------------------------storeee");
    try {
        // Check if a store already exists in the database based on its myshopify_domain
        const storeExist = await Store.findOne({ myshopify_domain: session.shop })
        if (storeExist) {
            return {
                status: true,
                message: `Store ${SuccessMessage.DATA_FETCHED}`,
                data: storeExist
            };
        }
        const shopInfo = await shopify.api.rest.Shop.all({
            session: session,
        });

        if (!shopInfo.data?.length) {
            return {
                status: false,
                message: `Store ${ErrorMessage.DATA_NOT_FOUND}`
            };
        }
        const storData = shopInfo.data[0];

        // paper  partner details
        const details = {
            shopJson: storData,
            myshopify_domain: storData.myshopify_domain,
        };
        const shopDetails = await Store.create(details);

        // added default app settings
        addedDefaultAppSettings(shopDetails._id, storData);

        //added default notification
        addedDefaultNotification(shopDetails._id, storData);

        return {
            status: true,
            message: `Store ${SuccessMessage.DATA_CREATED}`,
            data: shopDetails
        }
    }
    catch (error) {
        console.log("Error in storeInfo :", error)
        return {
            status: false,
            message: ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}

export const addedDefaultAppSettings = async (storeId, storData) => {
    try {
        const details = {
            storeId: storeId,
            businessName: storData.shop_owner,
            contactEmail: storData.email,
            phoneNumber: storData.phone,
            currency: storData.currency,
            quoteIdPrefix: "Q-",
            quoteSettings: {
                autoExpireQuote: {
                    isOn: false
                },
                expirationTime: {
                    time: "1days"
                },
                quoteReminderTime: {
                    time: "3days"
                }
            }
        }
        await AppSettings.create(details);
        return true
    }
    catch {
        console.log("Error in addedDefaultAppSettings :", error)
        return false
    }
}

export const addedDefaultNotification = async (storeId) => {
    try {
        const details = {
            storeId: storeId,
            enableStaffNotification: false,
            staffEmail: null,

            enableCustomerNotification: false,
            customerSenderEmail: null,

            quoteSubmitted: {
                "emailTemplate": null,
                "subject": null,
            },
            quoteQuoted: {
                "emailTemplate": null,
                "subject": null,
            },
            quoteAccepted: {
                "emailTemplate": null,
                "subject": null,
            },
            quoteRejected: {
                "emailTemplate": null,
                "subject": null,
            },
            quoteExpired: {
                "emailTemplate": null,
                "subject": null,
            },

        }
        await Notifications.create(details);
        return true

    } catch (error) {
        console.log("Error in addedDefaultNotification :", error)
        return false
    }
}


export const getPartnerInfo = async (shop) => {
    try {
        const details = await Store.findOne({ myshopify_domain: shop });
        return details;
    } catch (error) {
        console.error("Error in getPartnerInfo api:", error);
        return false;
    }
}
export const getStoreSettings = async (storeId) => {
    try {
        const details = await AppSettings.findOne({ storeId: storeId });
        if (!details) return { status: false, message: `Settings ${ErrorMessage.DATA_NOT_FOUND}` }
        return { status: true, message: `Settings ${SuccessMessage.DATA_FETCHED}`, data: details };
    } catch (error) {
        console.error("Error in getStoreSettings api:", error);
        return { status: false, message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR };
    }
}
export const updateStoreSettings = async (storeId, details) => {
    try {
        const result = await AppSettings.findOneAndUpdate({ storeId: storeId }, { $set: details }, { new: true });
        return { status: true, message: `Settings ${SuccessMessage.DATA_UPDATED}`, data: result };
    } catch (error) {
        console.error("Error in updateStoreSettings api:", error);
        return { status: false, message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR };
    }
}

export const storeGraphqlDetails = async (session) => {
    try {
        const client = new shopify.api.clients.Graphql({ session });
        const query =
            ` #graphql
            { 
            shop {
                name
                url
                myshopifyDomain
                email
             }
           }
        `
         const response = await client.request(query, {
            retries: 2,
        });
        return response;
    } catch (error) {
        console.error("Error in getShopInfoGraphQl", error);
        return false
    }

}

