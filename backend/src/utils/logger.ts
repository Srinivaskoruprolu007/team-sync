import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({ level, message, timestamp }) =>
                `[${timestamp}] ${level}: ${message}]`
        )
    ),
    transports: [
        new winston.transports.Console(),

        // save logs to files
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

export default logger;
