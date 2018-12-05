/** Main server file with initiate all required modules such as 
 *  database, express server, middlewares, etc.
 */

/**
 * 1. Check log paths, Database paths
 * 2. Start Server
 */

const server = require('./modules/server')

server.StartApplicationServer()
