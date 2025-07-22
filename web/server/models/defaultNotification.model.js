import mongoose from "mongoose";

const defaultNotificationsSchema = new mongoose.Schema({
    type: {
        type: String
    },
    emailTemplate: {
        type: String
    },
    subject: {
        type: String
    }
},
    { 'timestamps': true }

);

export const DefaultNotifications = mongoose.model("defaultNotifications", defaultNotificationsSchema);
