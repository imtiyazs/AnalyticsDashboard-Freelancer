const MongoClient = require('mongodb').MongoClient, // Create mongo database client instance
    mongo = require('mongodb'),
    constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    defaultSchema = require('./default')

let DBInstance = null // Database object

// Use connect method to connect to the server
exports.ConnectDatabaseServer = () => {
    return new Promise((resolve, reject) => {
        try {
            // Construct mongo database URL
            const url = 'mongodb://' + constants.DBServerAddress + ':' + constants.DBServerPort;
            const dbName = constants.DBName

            // Connect server to mongo database
            MongoClient.connect(url, {
                useNewUrlParser: true
            }, function (err, client) {
                if (err) {
                    logger.error('ConnectDatabaseServer: ' + err)
                    return reject()
                }

                // Assign created connected to database object
                DBInstance = client.db(dbName)
                // Generate default database with super admin
                defaultSchema.GenerateDefaultDBSchema()
                return resolve()
            });
        } catch (err) {
            logger.error('ConnectDatabaseServer: ' + err)
            return reject()
        }
    })
}

/**
 * Find user using ObjectID in document.
 */
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
                    callback(user)
                }
            })
        }
    })
}

/**
 * @param {*} DocumentCount: Number of documents to fetch. Integer Value
 * @param {*} collectionName: Collection Name
 */
exports.GetLatestDocuments = (DocumentCount, collectionName, callback) => {
    let collection = DBInstance.collection(collectionName)
    collection.find().limit(DocumentCount).sort({
        $natural: -1
    }).toArray(function (err, docs) {
        if (err) {
            logger.error()
            callback(null)
        } else {
            callback(docs)
        }
    })
}

/**
 * @param {*} QueryToMatch: Parameter to match. Ex: { a: 3 }
 * @param {*} collectionName: Collection Name
 */
exports.FindOneInCollection = (QueryToMatch, collectionName, callback) => {
    let collection = DBInstance.collection(collectionName)
    collection.findOne(QueryToMatch, (err, docs) => {
        if (err) {
            logger.error()
            callback(null)
        } else {
            callback(docs)
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
 * @param {*} FindQuery ex: { a: 2 }
 * @param {*} UpdateQuery: ex:  { $set: { b: 1 }}
 */
exports.UpdateDocument = (FindQuery, UpdateQuery, collectionName, callback) => {
    const collection = DBInstance.collection(collectionName);
    collection.updateOne(FindQuery, UpdateQuery, function (err, result) {
        if (err) {
            logger.error('UpdateDocument Error: ' + err)
            callback(null)
        } else {
            callback(result)
        }
    });
}

/**
 * @param {*} JSONObject: Ex: { a: 1 } */
exports.InsertOneDocument = (JSONObject, collectionName, callback) => {
    const collection = DBInstance.collection(collectionName)
    collection.insertOne(JSONObject, function (err, result) {
        if (err) {
            logger.error('InsertOneDocument Error: ' + err)
            callback(null)
        } else {
            callback(result)
        }
    })
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