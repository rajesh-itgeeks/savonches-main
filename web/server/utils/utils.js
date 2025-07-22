import { emailConfig } from "../config/email.js";
import nodemailer from "nodemailer";
import { QuotationHistory } from "../models/quotationHistory.model.js";
import { customAlphabet } from 'nanoid';
import { Quotation } from "../models/quotation.model.js";
import { templateDetails } from "../services/notificationService.js";
import { Liquid } from "liquidjs"
import { storeGraphqlDetails } from "../services/storeService.js";
import shopify from "../../shopify.js";
import { ProductTypes } from "../models/productTypes.model.js";
import { Designers } from "../models/designers.model.js";
import { metafieldKeys, pageHandle } from "../constants/enums.js";

const generateQuoteId = customAlphabet('0123456789', 10);

export const generateRandomId = async () => {
    const MAX_RETRIES = 20;

    try {
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            const id = generateQuoteId();
            const isExist = await Quotation.findOne({ quoteId: id });

            if (!isExist) {
                return id;
            }

            console.log(`ID exists (attempt ${attempt + 1}), retrying:`, id);
        }

        console.log("Max retries reached. Failed to generate unique ID.");
        return false;
    } catch (error) {
        console.log("Error in generateQuoteId API:", error);
        return false;
    }
};



export const sendEmail = async (senderEmail, receiverEmail, emailHtml, subject, replyToEmail) => {
    try {
        console.log("senderEmail---", senderEmail, "receiverEmail---", receiverEmail, "subject---", subject, "replyToEmail--- :", replyToEmail)
        // Create email transporter using the configured settings
        const transporter = nodemailer.createTransport(emailConfig);
        // Define email options for sending to customers
        const mailOptions = {
            from: senderEmail,
            to: receiverEmail,
            subject: subject,
            replyTo: replyToEmail || senderEmail,
            html: emailHtml
        }
        // Send email
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error(`Error in  email send :`, error);
            } else {
                console.log(`email send success:`, info.response);
            }
        });
        return {
            status: true
        }
    } catch (error) {
        console.error("Error in sendEmail:", error);
        return false
    }
};

export const timeStringToMs = (timeString = "") => {
    try {
        console.log("time string is ", timeString)
        const normalized = timeString.trim().toLowerCase();
        let totalMilliseconds
        // Define time units and their millisecond equivalents
        const timeUnits = {
            minutes: 60000,
            hours: 3600000,
            days: 86400000,
            week: 7 * 86400000,
            month: 30 * 86400000, // Special case for months
        };

        // Calculate the threshold date based on timeString
        for (const [unit, multiplier] of Object.entries(timeUnits)) {
            if (normalized.includes(unit)) {
                const value = parseInt(normalized.split(unit)[0], 10);
                totalMilliseconds = value * multiplier;
                console.log("time string to ms is ", totalMilliseconds);
                break;
            }
        }
        return totalMilliseconds;
        // Handle invalid or missing threshold date
    } catch (error) {
        console.log("Error in timeStringToMs api:", error);
        return false
    }
};


export const createQuotationHistory = async ({ quoteId, storeId, actionType, customerGid, quotedOffer }) => {
    try {
        await QuotationHistory.create({ quoteId, storeId, actionType, customerGid, quotedOffer })
        return true
    } catch (error) {
        console.log("Error in createQuotationHistory api:", error)
        return false
    }
}
export const prepareEmail = async (details, session) => {
    try {

        const { storeId, emailType, customerEmail, receiverType } = details
        console.log("Preparing Email for receiverType:", receiverType, "emailType:", emailType)

        const result = await templateDetails(emailType, storeId)

        // return if the setting is not enabled
        if (receiverType === "customer" && !result?.data?.enableCustomerNotification) return false
        if (receiverType === "merchant" && !result?.data?.enableStaffNotification) return false

        const storeDetails = await storeGraphqlDetails(session)

        let senderEmail = process.env.SMTP_USER, receiverEmail
        if (receiverType === "customer") {
            receiverEmail = customerEmail
        }
        else if (receiverType === "merchant") {
            receiverEmail = result?.data?.staffEmail || storeDetails?.data?.shop?.email
        }
        const emailTemplate = result.data?.emailTemplate
        const emailSubject = result.data?.subject

        if (!emailTemplate || !emailSubject) return false

        const variables = {
            quote_id: details?.quoteId,
            owner_name: details?.ownerName,
        }
        const { emailHtml, subject } = await convertLiquidToHtml(emailTemplate, emailSubject, variables)
        // await sendEmail(senderEmail, receiverEmail, emailHtml, subject, senderEmail)
        return true
    } catch (error) {
        console.error("Error in prepareEmail api:", error)
        return false
    }
}

export const convertLiquidToHtml = async (emailTemplate, emailSubject, variables) => {
    const engine = new Liquid();
    try {

        const emailHtml = await engine.parseAndRender(emailTemplate, variables);
        let subject;
        if (emailSubject) {
            subject = await engine.parseAndRender(emailSubject, variables);
        }
        return { emailHtml, subject }
    } catch (error) {
        console.log("Error catch in convertLiquidHtml", error);
        return false
    }
}

export const updatePageMetafield = async (session, key) => {
    let data

    if (key === metafieldKeys.PRODUCT_TYPES) {
        data = await ProductTypes.find({}).lean().select({ typeName: 1, typeImages: 1, _id: 0 })
    }
    else if (key === metafieldKeys.DESIGNERS) {
        data = await Designers.find({}).lean().select({ designerName: 1, _id: 0 })
    }
    else {
        return false
    }


    const sellWithUsPage = await fetchOnlineStorePages(session)
    const ownerId = sellWithUsPage?.node?.id

    if (!ownerId) {
        console.warn("Sell with us page not found , can not update metafield")
        return false
    }

    await updateMetafield(session, ownerId, data, key)
    return true
}

export const fetchOnlineStorePages = async (session) => {
    try {
        const client = new shopify.api.clients.Graphql({ session });

        const query = `
        {
          pages(first: 250,query:"handle:${pageHandle}") {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
  `;

        const response = await client.request(query, {
            retries: 2,
        });
        const pages = response?.data?.pages?.edges || [];
        const sellWithUsPage = pages.find((page) => page?.node?.handle === pageHandle);
        return sellWithUsPage;
    } catch (error) {
        console.error("Failed to fetch Online Store Pages:", error);
        return false;
    }
}
export const updateMetafield = async (session, ownerId, data, key) => {
    try {
        const client = new shopify.api.clients.Graphql({ session });

        const mutation = `
        mutation SetTheseMetafields($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              key
              namespace
              type
              value
            }
            userErrors {
              code
              message
              field
              elementIndex
            }
          }
        }
  `;

        const variables = {
            metafields: [
                {
                    namespace: "custom",
                    key: key,
                    value: JSON.stringify(data),
                    type: "json",
                    ownerId: ownerId
                }
            ]
        };

        const response = await client.request(mutation, {
            variables,
            retries: 2,
        });

        const errors = response?.body?.data?.metafieldsSet?.userErrors;

        if (errors && errors?.length > 0) {
            console.error("Shopify userErrors during metafield update:", errors);
            return false;
        }
        console.log("Metafield updated successfully key:", key);
        return true;
    } catch (error) {
        console.error("Failed to update metafield:", error);
        return [];
    }
}

