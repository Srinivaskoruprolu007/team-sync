import mongoose from "mongoose";
import { env } from "@/utils/getEnv";
import logger from "@/utils/logger";

const connectDatabase = async () => {
    const uri = env.mongo_uri;
    if (!uri) {
        logger.error("Missing MONGO_URI in .env file");
        throw new Error("Missing DB URI");
    }
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(uri, {
            autoIndex: true,
            serverSelectionTimeoutMS: 10000,
            maxPoolSize: 10,
        });
        logger.info("MongoDb connected successfully");
    } catch (error: Error | any) {
        logger.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        logger.warn("Database connection closed");
        process.exit(0);
    });
};

export default connectDatabase;
