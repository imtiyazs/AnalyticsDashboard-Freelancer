const database = require('../database/database'),
    constants = require('../common/constant'),
    logger = require('../common/logger').logger

exports.FetchUserReports = (requestBody) => {
    return new Promise((resolve, reject) => {
        let username = requestBody.username,
            limit = requestBody.limit

        if (limit == undefined || limit == 0 || limit == null) {
            database.FindOneInCollection({
                username: username
            }, constants.ReportsCollection, (data) => {
                if (data == null || data.length == 0) {
                    return reject(false)
                }

                resolve(data)
            })
        } else {

            database.FindOneInCollection({
                username: username
            }, constants.ReportsCollection, (data) => {
                if (data == null || data.length == 0) {
                    return reject(false)
                }

                try {

                    let dataArr = data.reports.slice(Math.max(data.reports.length - limit, 1))

                    let dataObj = {
                        username: data.username,
                        reports: dataArr.reverse()
                    }

                    resolve(dataObj)
                } catch (err) {
                    logger.error('Error fetching last elements from DB: ' + err)
                    return reject(false)
                }
            })

        }
    })
}