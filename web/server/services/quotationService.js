import shopify from "../../shopify.js";
import { emailTypes, paymentStatus, paymentTypes } from "../constants/enums.js";
import { quoteStatus as quoteStatuses } from "../constants/enums.js";
import { ErrorMessage, SuccessMessage } from "../constants/messages.js";
import { ProductTypes } from "../models/productTypes.model.js";
import { Quotation } from "../models/quotation.model.js";
import { uploadImages } from "../utils/uploadFile.js";
import { createQuotationHistory, generateRandomId, prepareEmail, timeStringToMs } from "../utils/utils.js";
import { getStoreSettings } from "./storeService.js";

export const submitQuote = async (details, storeId, files, session) => {
    try {
        //prepare quote details
        const customerDetails = await getCustomerInfo(details?.customerGid, session)
        if (!customerDetails) console.warn("Customer details not found customerGid:", details?.customerGid)

        const quoteId = await generateRandomId();
        if (!quoteId) return { status: false, message: "Error in generating quoteId" }

        const images = await uploadImages(files)
        if (!images.status) return { status: false, message: images?.message }

        const quotePayload = {
            ...details,
            quoteId,
            images: images?.data || [],
            quoteStatus: quoteStatuses.SUBMITTED,
            paymentStatus: paymentStatus.PENDING,
            paymentType: paymentTypes.NONE,
            timeline: { submittedDate: new Date() },
            quotedOffer: 0,
            contactData: customerDetails || {},
            storeId
        };

        const quotation = await Quotation.create(quotePayload);
        createQuotationHistory(
            {
                storeId,
                quoteId: quotation?.quoteId,
                actionType: quoteStatuses.SUBMITTED,
                customerGid: details?.customerGid
            })
        const appSettings = await getStoreSettings(storeId)
        //prepare email for customer
        prepareEmail({
            storeId,
            quoteId: quotation?.quoteId,
            emailType: emailTypes.QUOTE_SUBMITTED,
            customerGid: details?.customerGid,
            customerName: details?.customerName,
            ownerName: appSettings?.data?.ownerName,
            customerEmail: details?.customerEmail,
            receiverType: "customer",

        }, session)
        //prepare email for merchant
        prepareEmail({
            storeId,
            quoteId: quotation?.quoteId,
            emailType: emailTypes.QUOTE_SUBMITTED,
            customerName: details?.customerName,
            customerEmail: details?.customerEmail,
            receiverType: "merchant"
        }, session)
        return {
            status: true,
            message: `Store ${SuccessMessage.DATA_CREATED}`,
            data: quotation
        }
    } catch (error) {
        console.error("Error in submitQuote api:", { error, storeId, customerGid: details?.customerGid });
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const getCustomerInfo = async (customerGid, session) => {
    try {
        const client = new shopify.api.clients.Graphql({ session });
        const query = `query getCustomer($id: ID!) {
    customer(id: $id) {
      id
      firstName
      lastName
      defaultEmailAddress {
        emailAddress
      }
      defaultPhoneNumber {
        phoneNumber
      }
      defaultAddress {
        name
        formattedArea
        address1
        address2
        city
        country
        countryCodeV2
        province
        provinceCode
        zip
      }
    }
}`;

        const variables = {
            id: customerGid,
        };

        const response = await client.request(query, {
            variables: variables,
            retries: 2,
        });

        return response?.data?.customer;
    } catch (error) {
        console.log("Error in getCustomerInfo api:", error)
        return false
    }
}
export const adminUpdateQuote = async (details, id, storeId) => {
    try {
        details.timeline = {
            ...details.timeline,
            quotedDate: new Date(),
        };
        // if (details.quoteStatus === quoteStatuses.QUOTED) {
        //     details.timeline = {
        //         ...details.timeline,
        //         quotedDate: new Date(),
        //     };
        // }
        // // Auto-set expiration date if not provided and setting is enabled
        // if (!details.expirationDate) {
        //     const storeSettings = await getStoreSettings(storeId);
        //     const expirationSetting = storeSettings?.data?.quoteSettings?.expirationTime?.time;
        //     const isAutoExpireOn = storeSettings?.data?.quoteSettings?.autoExpireQuote?.isOn;

        //     if (isAutoExpireOn && expirationSetting) {
        //         const ms = timeStringToMs(expirationSetting);
        //         if (ms) {
        //             details.expirationDate = new Date(Date.now() + ms);
        //         }
        //     }
        // }

        // const quotation = await Quotation.findByIdAndUpdate(
        //     details.id,
        //     details,
        //     { new: true }
        // );
        const quotation = await Quotation.updateOne({ _id: id }, { $set: details })
        if (!quotation) {
            return {
                status: false,
                message: `Quotation ${ErrorMessage.DATA_NOT_FOUND}`
            }
        }
        createQuotationHistory(
            {
                storeId,
                quoteId: quotation?.quoteId,
                actionType: quoteStatuses.QUOTED,
                customerGid: quotation?.customerGid,
                quotedOffer: quotation?.quotedOffer
            })

        return {
            status: true,
            message: `Quotation ${SuccessMessage.DATA_UPDATED}`,
            data: quotation
        }
    } catch (error) {
        console.log("Error in adminUpdateQuote api:", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const customerUpdateQuote = async (details, storeId) => {
    try {
        if (details.quoteStatus === quoteStatuses.QUOTED) {
            details.timeline = {
                ...details.timeline,
                quotedDate: new Date(),
            };
        }
        // Auto-set expiration date if not provided and setting is enabled
        if (!details.expirationDate) {
            const storeSettings = await getStoreSettings(storeId);
            const expirationSetting = storeSettings?.data?.quoteSettings?.expirationTime?.time;
            const isAutoExpireOn = storeSettings?.data?.quoteSettings?.autoExpireQuote?.isOn;

            if (isAutoExpireOn && expirationSetting) {
                const ms = timeStringToMs(expirationSetting);
                if (ms) {
                    details.expirationDate = new Date(Date.now() + ms);
                }
            }
        }

        const quotation = await Quotation.findByIdAndUpdate(
            details.id,
            details,
            { new: true }
        );

        if (!quotation) {
            return {
                status: false,
                message: `Quotation ${ErrorMessage.DATA_NOT_FOUND}`
            }
        }

        return {
            status: true,
            message: `Quotation ${SuccessMessage.DATA_UPDATED}`,
            data: quotation
        }
    } catch (error) {
        console.log("Error in adminUpdateQuote api:", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}

export const quotationList = async (details, storeId) => {
    try {
        const { page = 1, limit = 10, status, search, dateFrom, dateTo } = details;
        const skip = (page - 1) * limit;

        // Build dynamic filter query
        const filter = { storeId };

        if (status && Array.isArray(status) && status.length) {
            filter.quoteStatus = { $in: status };
        }

        //this is for query search for quoteId ,customerName, customerEmail
        if (search) {
            filter.$or = [
                { quoteId: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { customerEmail: { $regex: search, $options: 'i' } },
            ];
        }

        //For date wise filter
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) {
                const endOfDay = new Date(dateTo);
                endOfDay.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = endOfDay;
            }
        }

        const [list, totalCount] = await Promise.all([
            Quotation.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Quotation.countDocuments(filter),
        ]);

        return {
            status: true,
            message: list.length
                ? `Quotation ${SuccessMessage.DATA_FETCHED}`
                : `Quotation ${ErrorMessage.DATA_NOT_FOUND}`,
            data: {
                list,
                pagination: {
                    total: totalCount,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(totalCount / limit),
                },
            },
        };
    } catch (error) {
        console.log("Error in quotationList api:", error);
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR,
        };
    }
};
export const allCustomerQuotations = async (details) => {
    try {
        // for filtering the data
        const { page = 1, limit = 10, status, search, dateFrom, dateTo, customerGid } = details;
        const skip = (page - 1) * limit;

        // Build dynamic filter query
        const filter = { customerGid };

        if (status && Array.isArray(status) && status.length) {
            filter.quoteStatus = { $in: status };
        }

        //this is for query search for quoteId ,customerName, customerEmail, productName, productType
        if (search) {
            filter.$or = [
                { quoteId: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { customerEmail: { $regex: search, $options: 'i' } },
                { productName: { $regex: search, $options: 'i' } },
                { productType: { $regex: search, $options: 'i' } },
            ];
        }

        // //For date wise filter
        // if (dateFrom || dateTo) {
        //     filter.createdAt = {};
        //     if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        //     if (dateTo) {
        //         const endOfDay = new Date(dateTo);
        //         endOfDay.setHours(23, 59, 59, 999);
        //         filter.createdAt.$lte = endOfDay;
        //     }
        // }

        const [list, totalCount] = await Promise.all([
            Quotation.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Quotation.countDocuments(filter),
        ]);

        return {
            status: true,
            message: list.length
                ? `Quotation ${SuccessMessage.DATA_FETCHED}`
                : `Quotation ${ErrorMessage.DATA_NOT_FOUND}`,
            data: {
                list,
                pagination: {
                    total: totalCount,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(totalCount / limit),
                },
            },
        };
    } catch (error) {
        console.log("Error in allCustomerQuotations api:", error);
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR,
        };
    }
};
// export const quotationList = async (details, storeId) => {
//     try {
//         const { page = 1, limit = 10 } = details; // default to page 1, 10 items per page
//         console.log(page, limit)
//         const skip = (page - 1) * limit;

//         const [list, totalCount] = await Promise.all([
//             Quotation.find({ storeId: storeId })
//                 .skip(skip)
//                 .limit(limit),
//             Quotation.countDocuments({ storeId: storeId })
//         ]);

//         return {
//             status: true,
//             message: list.length ? `Quotation ${SuccessMessage.DATA_FETCHED}` : `Quotation ${ErrorMessage.DATA_NOT_FOUND}`,
//             data: {
//                 list, pagination: {
//                     total: totalCount,
//                     page: parseInt(page),
//                     limit: parseInt(limit),
//                     totalPages: Math.ceil(totalCount / limit)
//                 }
//             },

//         }
//     } catch (error) {
//         console.log("Error in quotationList api:", error)
//         return {
//             status: false,
//             message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
//         }
//     }
// }
export const getQuoteById = async (id) => {
    try {
        const quoteData = await Quotation.findOne({ _id: id });
        if (!quoteData) {
            return {
                status: false,
                message: `Quotation ${ErrorMessage.DATA_NOT_FOUND}`
            }
        }

        return {
            status: true,
            message: `Quotation ${SuccessMessage.DATA_FETCHED}`,
            data: quoteData

        }
    } catch (error) {
        console.log("Error in getQuoteById api:", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
export const productTypesList = async (storeId) => {
    try {
        const data = await ProductTypes.find({ storeId }).lean().sort({ createdAt: -1 });
        return {
            status: true,
            message: `Product Types ${SuccessMessage.DATA_FETCHED}`,
            data: data

        }
    } catch (error) {
        console.log("Error in productTypesList api:", error)
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        }
    }
}
