const database = require('../database/database'),
    constants = require('../common/constant')
// bcrypt = require('bcrypt')

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
                    //TODO: Enable bcrypt somewhere else since bcrypt isnt getting installed on my PC
                    // bcrypt.hash(RequestBody.password, constants.BcryptSaltRounds)
                    //     .then(hashedPassword => {
                    database.InsertManyDocuments([{
                        username: RequestBody.username,
                        password: RequestBody.password,
                        email: RequestBody.email,
                        role: 'normal',
                        lastlogin: new Date().toISOString()
                    }], constants.UsersCollection, (results) => {
                        resolve(results)
                    })
                    // })
                    // .catch(err => {
                    //     reject('Error in Registration: ' + err)
                    // })
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
                if (username === user.username && password === user.password) {
                    database.UpdateDocument({
                        username: username
                    }, {
                        $set: {
                            lastlogin: new Date().toISOString()
                        }
                    }, constants.UsersCollection, (data) => {})
                    return resolve(user)
                }
            })

            return reject('Incorrect Password')
        })
    })
}