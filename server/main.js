/** Main server file with initiate all required modules such as 
 *  database, express server, middlewares, etc.
 */

/**
 * 1. Check log paths, Database paths
 * 2. Start Server
 */

const server = require('./modules/server'),
    database = require('./database/database'),
    logger = require('./common/logger').logger

database.ConnectDatabaseServer()
    .then(() => {
        logger.info('Database Server Connected Successfully')
        server.StartApplicationServer()
    })
    .catch(err => {
        logger.error('ConnectDatabaseServer: ' + err)
    })