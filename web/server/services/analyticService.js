import { quoteStatus } from "../constants/enums.js";
import { ErrorMessage, SuccessMessage } from "../constants/messages.js";
import { Quotation } from "../models/quotation.model.js";

export const dashboardSummary = async (storeId) => {
    try {
        const result = await Quotation.aggregate([
            {
                $match: { storeId } // Apply filter to all operations
            },
            {
                $facet: {
                    totalQuotationCount: [{ $count: "count" }],
                    newRequestCount: [
                        { $match: { quoteStatus: quoteStatus.SUBMITTED } },
                        { $count: "count" }
                    ],
                    totalQuotedOffer: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: "$quotedOffer" }
                            }
                        }
                    ]
                }
            }
        ]);

        const summary = result[0];

        const totalQuotationCount = summary.totalQuotationCount[0]?.count || 0;
        const newRequestCount = summary.newRequestCount[0]?.count || 0;
        const totalQuotedOffer = summary.totalQuotedOffer[0]?.total || 0;

        return {
            status: true,
            message: `Dashboard Summary ${SuccessMessage.DATA_FETCHED}`,
            data: {
                totalQuotationCount,
                newRequestCount,
                totalValue: totalQuotedOffer
            }
        };
    } catch (error) {
        console.log("Error in dashboardSummary:", error);
        return {
            status: false,
            message: error?.message || ErrorMessage.INTERNAL_SERVER_ERROR
        };
    }
};



