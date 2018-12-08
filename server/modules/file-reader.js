const constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    database = require('../database/database'),
    path = require('path')

exports.UploadAndReadFile = (req, res) => {
    return new Promise((resolve, reject) => {

        /** Extract all required data from Headers and Multer Middleware */
        let fileType = path.extname(String(req.file.originalname)),
            filename = String(req.file.originalname).replace(/\s/g, ''),
            username = String(req.headers.username).replace(/\s/g, ''),
            fileBuffer = req.file.buffer

        /**Create Require directory structure and return folder path */
        FileHandler(username, fileType)
            .then((folderPath) => {

                /** Create path of source file uploaded */
                let filePath = path.join(folderPath, filename)

                /** Write multer buffer to source filepath */
                require('fs-extra').writeFile(filePath, fileBuffer, (error) => {
                    if (error) {
                        logger.error('Write source file: ' + error)
                        return reject(error)
                    }

                    /** Add To Uploads Collection in DB */
                    LogUploadsToDatabase(username, fileType, filePath)

                    /** Perform file operation based on filetypes */
                    switch (fileType) {
                        case '.sav':
                            /** Read SAV Files and return the file data */
                            ReadSAVFiles(username, filename, filePath)
                                .then(JSONData => {
                                    return resolve(JSONData)
                                })
                                .catch(error => {
                                    logger.error('ReadSAVFiles: ' + error)
                                    return reject(error)
                                })
                            break
                    }
                })
            })
            .catch(err => {
                logger.error('FileHandler: ' + err)
                return reject(err)
            })
    })
}

/** Read sav or SPSS files */
function ReadSAVFiles(username, fileName, sourceFilePath) {
    return new Promise((resolve, reject) => {

        /** Construct destination file path of JSON to be created */
        let DestinationFilePath = path.join(constants.AppUploadsDir, constants.AppJSONFilesDir, username),
            JSONFileName = fileName + '.json'

        /** Check and create directories with permissions */
        require('fs-extra').ensureDir(DestinationFilePath, 0o2775, (err) => {
            if (err) {
                logger.error('ReadSAVFiles: ' + err)
                return reject('ReadSAVFiles: ' + err)
            }

            let DestFilePath = path.join(DestinationFilePath, JSONFileName)

            /** Execute python program of reading SAV files and generate JSON file on above destination path */
            require('child_process').exec(constants.SAVFileReaderFile + ' ' + sourceFilePath + ' ' + DestFilePath, (err) => {
                if (err) {
                    logger.error('ReadSAVFiles: ' + err)
                    return reject('ReadSAVFiles: ' + err)
                }

                /** Read and return data from JSON file */
                require('fs-extra').readFile(DestFilePath, (error, fileBuffer) => {
                    if (error) {
                        logger.error('ReadSAVFiles: ' + err)
                        return reject('ReadSAVFiles: ' + err)
                    }

                    try {
                        resolve(JSON.parse(fileBuffer))
                    } catch (err) {
                        logger.error('ReadSAVFiles: ' + err)
                        return reject('ReadSAVFiles: ' + err)
                    }
                })
            })
        })
    })
}

/** Create and ensure file paths */
function FileHandler(username, fileType) {
    return new Promise((resolve, reject) => {

        let filePath = path.join(constants.AppUploadsDir, constants.AppOTHERFilesDir, username)

        switch (fileType) {
            case '.sav':
                filePath = path.join(constants.AppUploadsDir, constants.AppSavFilesDir, username)
                break
        }

        require('fs-extra').ensureDir(filePath, 0o2775, (err) => {
            if (err) {
                logger.error('FileHandler: ' + err)
                reject('FileHandler: ' + err)
            }
            resolve(filePath)
        })
    })
}

function LogUploadsToDatabase(userId, fileType, filePath) {
    database.FindInCollection({
        username: userId
    }, constants.UploadsCollection, (data) => {
        let DBQuery = null
        if (data == null || data.length == 0) {
            // Add new document
            /** Query selector */
            switch (fileType) {
                case '.sav':
                    DBQuery = [{
                        username: userId,
                        lastupload: new Date().toISOString(),
                        uploads: {
                            sav: [filePath],
                            xls: [],
                            json: []
                        }
                    }]
                    break

                case '.xls':
                    DBQuery = [{
                        username: userId,
                        lastupload: new Date().toISOString(),
                        uploads: {
                            sav: [],
                            xls: [filePath],
                            json: []
                        }
                    }]
                    break

                case '.json':
                    DBQuery = [{
                        username: userId,
                        lastupload: new Date().toISOString(),
                        uploads: {
                            sav: [],
                            xls: [],
                            json: [filePath]
                        }
                    }]
                    break
            }

            database.InsertManyDocuments(DBQuery, constants.UploadsCollection, (err) => {
                if (err == null) {
                    logger.error('LogUploadsToDatabase: Cannot Insert Document')
                }
            })

        } else {
            // Update current document
            /** Query selector */
            switch (fileType) {
                case '.sav':
                    DBQuery = {
                        $push: {
                            'uploads.sav': filePath
                        }
                    }
                    break

                case '.xls':
                    DBQuery = {
                        $push: {
                            'uploads.xls': filePath
                        }
                    }
                    break

                case '.json':
                    DBQuery = {
                        $push: {
                            'uploads.json': filePath
                        }
                    }
                    break
            }

            /** Update Timestamp */
            database.UpdateDocument({
                username: userId
            }, {
                $set: {
                    lastupload: new Date().toISOString()
                }
            }, constants.UploadsCollection, (err) => {
                if (err == null) {
                    logger.error('LogUploadsToDatabase: Cannot Update Document')
                }
            })

            /** Add File To Array */
            database.UpdateDocument({
                username: userId
            }, DBQuery, constants.UploadsCollection, (err) => {
                if (err == null) {
                    logger.error('LogUploadsToDatabase: Cannot Update Document')
                }
            })
        }
    })
}