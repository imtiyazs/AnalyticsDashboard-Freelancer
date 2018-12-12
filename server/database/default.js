const constants = require('../common/constant'),
    database = require('./database'),
    bcrypt = require('bcrypt')

exports.GenerateDefaultDBSchema = () => {

    /** Check and write default admin user to database */
    database.FindOneInCollection({
        username: constants.DefaultRootUser
    }, constants.UsersCollection, (data) => {
        if (data == null || data.length == 0) {
            let hashRootPassword = bcrypt.hashSync(constants.DefaultRootPassword, constants.BcryptSaltRounds)
            database.InsertManyDocuments([{
                username: constants.DefaultRootUser,
                password: hashRootPassword,
                email: "root@system.com",
                role: "superadmin",
                lastlogin: new Date().toISOString()
            }], constants.UsersCollection, () => {

            })
        }
    })

    /** Default message in announcement */
    database.FindInCollection({
        message: constants.WelcomeMessage
    }, constants.AnnouncementCollection, (data) => {
        if (data == null || data.length == 0) {
            database.InsertManyDocuments([{
                message: constants.WelcomeMessage
            }], constants.AnnouncementCollection, () => {

            })
        }
    })
}