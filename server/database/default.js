const constants = require('../common/constant'),
    database = require('./database'),
    bcrypt = require('bcrypt')

/**
 * Generate default database on fresh installation and start
 * of server. Creates super admin account.
 * User: admin
 * Pass: admin
 */
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
                lastlogin: new Date().toISOString(),
                firstName: "",
                lastName: "",
                phone: "",
                address1: "",
                address2: "",
                city: "",
                state: "",
                country: "",
                zip: ""
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
                creationDate: new Date().toISOString(),
                message: constants.WelcomeMessage
            }], constants.AnnouncementCollection, () => {

            })
        }
    })
}