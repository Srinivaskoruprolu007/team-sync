import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: () =>
                new Intl.DateTimeFormat("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                }).format(new Date()),
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaString = Object.keys(meta).length
                ? JSON.stringify(meta, null, 2)
                : "";
            return `${timestamp} ${level}: ${message} ${metaString}`;
        })
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
