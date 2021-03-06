const constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    database = require('../database/database'),
    bcrypt = require('bcrypt')

exports.UserMgmtFunction = (requestBody) => {
    return new Promise((resolve, reject) => {

        if (requestBody.auth !== 'superadmin') {
            return reject('Unauthorized Access')
        }

        let targetUser = requestBody.username,
            operation = requestBody.operation

        switch (operation) {
            // Change Role
            case 1:
                database.FindOneInCollection({
                    username: targetUser
                }, constants.UsersCollection, (data) => {
                    if (data == null || data.length == 0) {
                        return reject('User Not Found')
                    }

                    database.UpdateDocument({
                        username: targetUser
                    }, {
                        $set: {
                            role: requestBody.role
                        }
                    }, constants.UsersCollection, () => {
                        return resolve('User Updated Successfully')
                    })
                })
                break

                // Reset Password to 123456
            case 2:
                database.FindOneInCollection({
                    username: targetUser
                }, constants.UsersCollection, (data) => {
                    if (data == null || data.length == 0) {
                        return reject('User Not Found')
                    }

                    bcrypt.hash('123456', constants.BcryptSaltRounds)
                        .then(hashedPassword => {
                            database.UpdateDocument({
                                username: targetUser
                            }, {
                                $set: {
                                    password: hashedPassword
                                }
                            }, constants.UsersCollection, () => {
                                return resolve('Password Reset Successful')
                            })
                        })
                        .catch(err => {
                            logger.error('Error Reset Password: ' + err)
                            reject('Error Resetting Password')
                        })

                })
                break

                // Block Unblock User
            case 3:
                database.FindOneInCollection({
                    username: targetUser
                }, constants.UsersCollection, (data) => {
                    if (data == null || data.length == 0) {
                        return reject('User Not Found')
                    }

                    database.UpdateDocument({
                        username: targetUser
                    }, {
                        $set: {
                            isBlocked: requestBody.isBlocked
                        }
                    }, constants.UsersCollection, () => {
                        if (requestBody.isBlocked) {
                            return resolve('User Account Suspended')
                        } else {
                            return resolve('User Account Unblocked Successfully')
                        }
                    })
                })
                break

                // Delete User
            case 4:

                database.FindOneInCollection({
                    username: targetUser
                }, constants.UsersCollection, (data) => {
                    if (data == null || data.length == 0) {
                        return reject('User Not Found')
                    }

                    database.DeleteDocument({
                        username: targetUser
                    }, constants.UsersCollection, () => {
                        return resolve('Account Deleted Successfully')
                    })

                })
                break

        }
    })
}

exports.GetUserList = (requestBody) => {
    return new Promise((resolve, reject) => {

        if (requestBody.auth !== 'superadmin') {
            return reject('Not Authorized For The Operation')
        }

        database.FindInCollection({}, constants.UsersCollection, (data) => {
            if (data == null || data.length == 0) {
                return reject(false)
            }

            let UserObjArray = []

            data.forEach(element => {
                let UserObj = {}
                UserObj['username'] = element.username
                UserObj['role'] = element.role
                UserObj['isBlocked'] = element.isBlocked
                UserObj['email'] = element.email
                UserObjArray.push(UserObj)
            });

            resolve(UserObjArray)
        })
    })
}

exports.UserProfileOperation = (requestBody) => {
    return new Promise((resolve, reject) => {

        let operationType = requestBody.operation,
            userId = requestBody.userId

        switch (operationType) {
            // Update the profile
            case 0:
                UpdateUserProfile(userId, requestBody.profileData)
                    .then((userData) => {
                        return resolve({
                            message: 'Profile Updated Successfully',
                            profileData: userData
                        })
                    })
                    .catch(err => {
                        return reject('Error Updating Profile: ' + err)
                    })
                break

                // Change The Password
            case 1:
                ChangeUserPassword(userId, requestBody.passObj)
                    .then((message) => {
                        return resolve(message)
                    })
                    .catch(err => {
                        return reject(err)
                    })
                break

                // Delete the account
            case 2:
                DeactivateAccount(userId, requestBody.password)
                    .then(msg => {
                        return resolve(msg)
                    })
                    .catch(error => {
                        return reject(error)
                    })
                break
        }
    })
}

function DeactivateAccount(userId, password) {
    return new Promise((resolve, reject) => {
        database.FindOneInCollection({
            username: userId
        }, constants.UsersCollection, (userData) => {

            if (userData.role == 'superadmin') {
                return reject('Super Admin account cannot be deleted')
            }

            let passCheck = bcrypt.compareSync(password, userData.password)

            if (passCheck) {
                database.InsertManyDocuments([userData], constants.TrashCollection, () => {
                    database.DeleteDocument({
                        username: userId
                    }, constants.UsersCollection, () => {
                        return resolve('Account Deleted Successfully')
                    })
                })
            } else {
                return reject('Incorrect Account Password')
            }
        })
    })
}

function ChangeUserPassword(userId, passwordObj) {
    return new Promise((resolve, reject) => {
        database.FindOneInCollection({
            username: userId
        }, constants.UsersCollection, (userData) => {

            let passCheck = bcrypt.compareSync(passwordObj.oldPass, userData.password)

            if (passCheck) {
                bcrypt.hash(passwordObj.newPass, constants.BcryptSaltRounds, (error, hashed) => {
                    if (error) {
                        logger.error('ChangeUserPassword: ' + error)
                        return reject('Cannot change password')
                    }

                    database.UpdateDocument({
                        username: userId
                    }, {
                        $set: {
                            password: hashed
                        }
                    }, constants.UsersCollection, () => {
                        return resolve('Password Changed Successfully')
                    })
                })
            } else {
                return reject('Old password does not match the records')
            }
        })
    })
}

function UpdateUserProfile(userId, profileData) {
    return new Promise((resolve, reject) => {
        database.FindOneInCollection({
            username: userId
        }, constants.UsersCollection, (data) => {
            if (data == null || data.length == 0) {
                logger.error('UpdateUserProfile Error: ' + data)
                return reject('Error Fetching User Details: ' + data)
            }

            database.UpdateDocument({
                username: userId
            }, {
                $set: {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phone: profileData.phone,
                    address1: profileData.address1,
                    address2: profileData.address2,
                    city: profileData.city,
                    state: profileData.state,
                    country: profileData.country,
                    zip: profileData.zip,
                }
            }, constants.UsersCollection, () => {
                database.FindOneInCollection({
                    username: userId
                }, constants.UsersCollection, (user) => {
                    return resolve(user)
                })
            })
        })
    })
}