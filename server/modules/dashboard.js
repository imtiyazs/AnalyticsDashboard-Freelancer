const constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    database = require('../database/database')

exports.GetDashboardStatistics = (req) => {
    return new Promise((resolve) => {

        let username = req.body.username

        let ResponseData = {
            announcements: null,
            totalReportUploads: null,
            totalFileUploads: null,
            lastReportSummary: null
        }

        /** Get Last Report and Total Report count Of User */
        const GetReportsdata = () => {
            return new Promise(resolve => {
                database.FindOneInCollection({
                    username: username
                }, constants.ReportsCollection, (data) => {
                    resolve(data)
                })
            })
        }

        /** Get Total File Uploads of User */
        const GetFileUploads = () => {
            return new Promise(resolve => {
                database.FindOneInCollection({
                    username: username
                }, constants.UploadsCollection, (data) => {
                    try {
                        resolve(data.uploads.sav.length + data.uploads.xls.length)
                    } catch (err) {
                        logger.error('GetFileUploads: ' + err)
                        resolve(null)
                    }
                })
            })
        }

        /** Get Announcements */
        const GetAnnouncements = () => {
            return new Promise(resolve => {
                database.GetLatestDocuments(5, constants.AnnouncementCollection, (data) => {
                    resolve(data)
                })
            })
        }


        Promise.all([GetAnnouncements(), GetFileUploads(), GetReportsdata()])
            .then(results => {
                ResponseData.announcements = results[0]
                ResponseData.totalFileUploads = results[1]
                ResponseData.totalReportUploads = results[2].reports.length
                ResponseData.lastReportSummary = results[2].reports
                resolve(ResponseData)
            })
            .catch(error => {
                logger.error('GetDashboardStatistics: ' + error)
                resolve(ResponseData)
            })
    })
}