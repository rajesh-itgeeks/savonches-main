import mongoose from "mongoose";

export const dbConnection = async () => {
    mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}?authSource=admin`)
        .then(() => {
            console.log("--- Connected to Mongoose Successfully ---");
        })
        .catch((error) => {
            console.log(error, "--- Mongoose Can't Connect ---");
        });
};
