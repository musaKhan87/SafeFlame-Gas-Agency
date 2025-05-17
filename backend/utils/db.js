const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDb = async () => {
    try {
        if (!URI) {
            console.error("MONGODB_URI not set in environment variables.");
            process.exit(1);
        }
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.error(" MongoDB connection failed:", error.message);
        process.exit(1);
    }
}


module.exports = connectDb;