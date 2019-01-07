const constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    database = require('../database/database')

/** 
 * Function to create read delete announcements
 * inside announcement collection by super admin user
 * 
 * Takes request body as input
 */
exports.Announcements = (requestbody) => {
    return new Promise((resolve, reject) => {

        let announceMessage = requestbody.message,
            operation = requestbody.operation // Operation number from client end

        switch (operation) {
            case 1: // Write announcement in database
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