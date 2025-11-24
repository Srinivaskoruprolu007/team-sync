import winston from 'winston';

const dedupeFormat = () => {
    let lastMessage: string | null = null;
    return winston.format((info) => {
        const message = String(info.message);
        if (message === lastMessage) return false; // skip duplicate
        lastMessage = message;
        return info;
    })();
};

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        dedupeFormat(),
        winston.format.timestamp({
            format: () =>
                new Intl.DateTimeFormat('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                }).format(new Date()),
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
            return `${timestamp} ${level}: ${message} ${metaString}`;
        }),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, ...meta }) => {
                    const metaString = Object.keys(meta).length
                        ? JSON.stringify(meta, null, 2)
                        : '';
                    return `${timestamp} ${level}: ${message} ${metaString}`;
                }),
            ),
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.json(),
        }),
        new winston.transports.File({
            filename: 'logs/app.log',
            format: winston.format.json(),
        }),
    ],
});

export default logger;
