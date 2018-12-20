const constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    database = require('../database/database')

exports.Announcements = (requestbody) => {
    return new Promise((resolve, reject) => {

        let announceMessage = requestbody.message,
            operation = requestbody.operation

        switch (operation) {
            case 1: // Write announcement
                try {
                    database.InsertOneDocument({
                        message: announceMessage,
                        creationDate: new Date().toISOString()
                    }, constants.AnnouncementCollection, () => {
                        return resolve('Announcement Added Successfully')
                    })
                } catch (err) {
                    logger.error('Announcements: ' + err)
                    return reject('Error Adding Announcement')
                }
                break

            case 2: // Delete Announcement
                try {
                    database.DeleteDocument({
                        message: announceMessage
                    }, constants.AnnouncementCollection, () => {
                        return resolve('Announcement Deleted Successfully')
                    })
                } catch (err) {
                    logger.error('Announcements: ' + err)
                    return reject('Error Deleting Announcement')
                }
                break

            default: // Read announcement
                database.FindInCollection({}, constants.AnnouncementCollection, (data) => {
                    try {
                        return resolve(data.reverse())
                    } catch (err) {
                        logger.error('Announcements: ' + err)
                        return resolve(data)
                    }

                })

        }
    })
}