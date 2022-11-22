const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
});


function productionLogger() {
    return createLogger({
        level: 'info',

        format: combine(
            timestamp(),
            myFormat
        ),
        // defaultMeta: { service: 'user-service' },
        transports: [
            new transports.Console(),
            new transports.File({ filename: "info.log" })
        ],
    });
}
module.exports = productionLogger;