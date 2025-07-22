import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
    },
    enableStaffNotification: {
        type: Boolean,
        default: false
    },
    staffEmail: {
        type: String,
    },

    enableCustomerNotification: {
        type: Boolean,
        default: false
    },

    customerSenderEmail: {
        type: String,
    },

    quoteSubmitted: {
        type: JSON,
    },
    quoteQuoted: {
        type: JSON,
    },
    quoteAccepted: {
        type: JSON,
    },
    quoteRejected: {
        type: JSON,
    },
    quoteExpired: {
        type: JSON,
    },
},
    { 'timestamps': true }
);

export const Notifications = mongoose.model("notifications", notificationsSchema);
