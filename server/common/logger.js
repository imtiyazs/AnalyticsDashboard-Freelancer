/**
 * Create logger instance for logging server details and errors
 * The logs will be created to root path of server
 */
const winston = require('winston')
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: require('./constant').AppLogFile
        })
    ]
})

exports.logger = logger