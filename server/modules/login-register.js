const database = require('../database/database'),
    constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    bcrypt = require('bcrypt')

exports.RegisterNewUser = (RequestBody) => {
    return new Promise((resolve, reject) => {
        database.FindInCollection({
            username: RequestBody.username
        }, constants.UsersCollection, (data) => {
            if (data == null) {
                reject('Database Error occured')
            }

            try {
                if (data.length === 0) {
                    bcrypt.hash(RequestBody.password, constants.BcryptSaltRounds)
                        .then(hashedPassword => {
                            database.InsertManyDocuments([{
                                username: RequestBody.username,
                                password: hashedPassword,
                                email: RequestBody.email,
                                isBlocked: false,
                                role: 'normal',
                                firstName: "",
                                lastName: "",
                                phone: "",
                                address1: "",
                                address2: "",
                                city: "",
                                state: "",
                                country: "",
                                zip: "",
                                lastlogin: new Date().toISOString()
                            }], constants.UsersCollection, (results) => {
                                resolve(results)
                            })
                        })
                        .catch(err => {
                            reject('Error in Registration: ' + err)
                        })
                } else {
                    reject('User with username "' + RequestBody.username + '" already exists.')
                }
            } catch (err) {
                reject('Unexpected Error: ' + err)
            }
        })
    })
}

exports.UserLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        database.FindInCollection({
            username: username
        }, constants.UsersCollection, (data) => {
            if (data == null) {
                return reject('User does not exist')
            }

            data.forEach(user => {
                if (username === user.username) {

                    let passCheck = bcrypt.compareSync(password, user.password)
                    if (!passCheck) {
                        return reject('Incorrect Password')
                    }

                    if (user.isBlocked) {
                        return reject('Your Account Has Been Suspended')
                    }

                    try {
                        database.UpdateDocument({
                            username: username
                        }, {
                            $set: {
                                lastlogin: new Date().toISOString()
                            }
                        }, constants.UsersCollection, (data) => {})

                    } catch (err) {
                        logger.error('UserLogin: ' + err)
                        return reject('Error While Login')
                    }

                    return resolve(user)
                }
            })

            return reject('Incorrect Password')
        })
    })
}