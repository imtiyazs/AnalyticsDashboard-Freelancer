const MongoClient = require('mongodb').MongoClient,
    mongo = require('mongodb'),
    constants = require('../common/constant'),
    logger = require('../common/logger').logger

let DBInstance = null

// Use connect method to connect to the server
exports.ConnectDatabaseServer = () => {
    return new Promise((resolve, reject) => {
        const url = 'mongodb://' + constants.DBServerAddress + ':' + constants.DBServerPort;
        const dbName = constants.DBName

        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                reject()
            }

            DBInstance = client.db(dbName)
            resolve()
        });
    })
}

exports.FindByObjectID = (id, collectionName, callback) => {
    let collection = DBInstance.collection(collectionName),
        o_id = new mongo.ObjectID(id)
    collection.find({
        _id: o_id
    }).toArray(function (err, data) {
        if (err) {
            logger.error('FindByObjectID: ' + err)
            callback(null)
        } else {
            data.forEach(user => {
                if (String(id).toLowerCase() === String(user._id).toLowerCase()) {
                    callback({
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    })
                }
            })
        }
    })
}

/**
 * @param {*} QueryToMatch: Parameter to match. Ex: { a: 3 }
 * @param {*} collectionName: Collection Name
 */
exports.FindInCollection = (QueryToMatch, collectionName, callback) => {
    let collection = DBInstance.collection(collectionName)
    collection.find(QueryToMatch).toArray(function (err, docs) {
        if (err) {
            logger.error()
            callback(null)
        } else {
            callback(docs)
        }
    })
}

/**
 * @param {*} UpdateQuery: ex: { a: 2 }, { $set: { b: 1 }}
 */
exports.UpdateDocument = (UpdateQuery, collectionName, callback) => {
    const collection = DBInstance.collection(collectionName);
    collection.updateOne(UpdateQuery, function (err, result) {
        if (err) {
            logger.error('UpdateDocument Error: ' + err)
            callback(null)
        } else {
            callback(result)
        }
    });
}

/**
 * @param {*} ArrayToInsert: Ex: [{ a: 1 }, { a: 2 }, { a: 3 }]
 */
exports.InsertManyDocuments = (ArrayToInsert, collectionName, callback) => {
    const collection = DBInstance.collection(collectionName)
    collection.insertMany(ArrayToInsert, function (err, result) {
        if (err) {
            logger.error('InsertManyDocuments Error: ' + err)
            callback(null)
        } else {
            callback(result)
        }
    })
}

/**
 * 
 * @param {*} queryToDeleteFrom:  Ex: Delete document where a = 3 | { a: 3 }
 * @param {*} collectionName; Name of Collection
 * @param {*} callback Data
 */
exports.DeleteDocument = (queryToDeleteFrom, collectionName, callback) => {
    const collection = DBInstance.collection(collectionName);
    collection.deleteOne(queryToDeleteFrom, (err, result) => {
        if (err) {
            logger.error('DeleteDocument: ' + err)
            callback(null)
        } else {
            callback(result)
        }
    })
}