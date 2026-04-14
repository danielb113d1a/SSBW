import winston from 'winston';

const { combine, timestamp, printf, colorize, align, json } = winston.format;

const consoleFormat = combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: consoleFormat
        }),
        new winston.transports.File({
            filename: './logs/info.log',
            level: 'info',
            format: combine(timestamp(), json())
        }),
        new winston.transports.File({
            filename: './logs/error.log',
            level: 'error',
            format: combine(timestamp(), json())
        })
    ]
});

export default logger;
