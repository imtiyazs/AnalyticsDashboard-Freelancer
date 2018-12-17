const database = require('../database/database'),
    constants = require('../common/constant'),
    logger = require('../common/logger').logger

exports.FetchUserReports = (requestBody) => {
    return new Promise((resolve, reject) => {
        let username = requestBody.username
        database.FindOneInCollection({
            username: username
        }, constants.ReportsCollection, (data) => {
            if (data == null || data.length == 0) {
                return reject(false)
            }

            resolve(data)
        })
    })
}