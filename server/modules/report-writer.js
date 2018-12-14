const database = require('../database/database'),
    constants = require('../common/constant'),
    logger = require('../common/logger').logger

exports.CheckAndWriteReports = (requestBody) => {
    return new Promise((resolve) => {

        let username = requestBody.userName,
            filename = requestBody.fileName,
            reportname = requestBody.reportName,
            reportData = requestBody.reportData,
            analyticsDataName = requestBody.analyticsDataName,
            analyticsData = requestBody.analyticsData

        database.FindOneInCollection({
            username: username
        }, constants.ReportsCollection, (data) => {
            if (data == null || data.length == 0) {
                //  Write new user document
                database.InsertManyDocuments([{
                    username: username,
                    reports: [{
                        fileName: filename,
                        reportName: reportname,
                        reportData: reportData,
                        analyticsDataName: analyticsDataName,
                        analyticsData: analyticsData
                    }]
                }], constants.ReportsCollection, () => {
                    return resolve(true)
                })
            } else {
                // Push new report
                database.UpdateDocument({
                    username: username
                }, {
                    $push: {
                        'reports': {
                            fileName: filename,
                            reportName: reportname,
                            reportData: reportData,
                            analyticsDataName: analyticsDataName,
                            analyticsData: analyticsData
                        }
                    }
                }, constants.ReportsCollection, () => {
                    return resolve(true)
                })
            }
        })
    })
}