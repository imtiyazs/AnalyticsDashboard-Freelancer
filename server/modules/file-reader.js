const constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    database = require('../database/database'),
    path = require('path'),
    csv = require('fast-csv')

exports.UploadAndReadFile = (req, res) => {
    return new Promise((resolve, reject) => {

        /** Extract all required data from Headers and Multer Middleware */
        let fileType = path.extname(String(req.file.originalname)).toLowerCase(),
            filename = String(req.file.originalname).replace(/\s/g, ''),
            reportname = String(req.body.reportname).replace(/\s/g, ''),
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

                    /** Perform file operation based on filetypes */
                    switch (fileType) {
                        case '.sav':
                            /** Read SAV Files and return the file data */
                            ReadFileWithPythonScript(username, filename, filePath)
                                .then(JSONData => {

                                    let DBDataObject = {
                                        reportName: reportname,
                                        fileName: filename,
                                        filePath: filePath,
                                        fileType: fileType,
                                        uploadedAt: new Date().toISOString(),
                                        dataValues: JSONData
                                    }

                                    /** Add To Uploads Collection in DB */
                                    LogUploadsToDatabase(username, DBDataObject)

                                    return resolve(DBDataObject)
                                })
                                .catch(error => {
                                    logger.error('ReadFileWithPythonScript: ' + error)
                                    return reject(error)
                                })
                            break

                        case '.xls':
                            /** Read EXCEL Files and return the file data */
                            ReadFileWithPythonScript(username, filename, filePath)
                                .then(JSONData => {

                                    let DBDataObject = {
                                        reportName: reportname,
                                        fileName: filename,
                                        filePath: filePath,
                                        fileType: fileType,
                                        uploadedAt: new Date().toISOString(),
                                        dataValues: JSONData
                                    }

                                    /** Add To Uploads Collection in DB */
                                    LogUploadsToDatabase(username, DBDataObject)

                                    return resolve(DBDataObject)
                                })
                                .catch(error => {
                                    logger.error('ReadFileWithPythonScript: ' + error)
                                    return reject(error)
                                })
                            break

                        case '.xlsx':
                            /** Read EXCEL Files and return the file data */
                            ReadFileWithPythonScript(username, filename, filePath)
                                .then(JSONData => {

                                    let DBDataObject = {
                                        reportName: reportname,
                                        fileName: filename,
                                        filePath: filePath,
                                        fileType: fileType,
                                        uploadedAt: new Date().toISOString(),
                                        dataValues: JSONData
                                    }

                                    /** Add To Uploads Collection in DB */
                                    LogUploadsToDatabase(username, DBDataObject)

                                    return resolve(DBDataObject)
                                })
                                .catch(error => {
                                    logger.error('ReadFileWithPythonScript: ' + error)
                                    return reject(error)
                                })
                            break

                        case '.csv':
                            ReadCSVFiles(filePath)
                                .then(JSONData => {

                                    let DBDataObject = {
                                        reportName: reportname,
                                        fileName: filename,
                                        filePath: filePath,
                                        fileType: fileType,
                                        uploadedAt: new Date().toISOString(),
                                        dataValues: JSONData
                                    }

                                    /** Add To Uploads Collection in DB */
                                    LogUploadsToDatabase(username, DBDataObject)

                                    return resolve(DBDataObject)
                                })
                                .catch(error => {
                                    logger.error('ReadCSVFiles: ' + error)
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

/** Read CSV Files */
function ReadCSVFiles(sourceFilePath) {
    return new Promise((resolve, reject) => {
        let array = []
        csv
            .fromPath(sourceFilePath, {
                headers: true,
                ignoreEmpty: true,
                discardUnmappedColumns: true
            })
            .on("data", function (data) {
                array.push(data)
            })
            .on("end", function () {
                let dataObj = {}
                Object.keys(array[0]).map((key) => {
                    dataObj[key] = array.map((x) => x[key]);
                })
                return resolve(dataObj)
            })
            .on('error', function (err) {
                logger.error('ReadCSVFiles: ' + err)
                return reject('Invalid CSV File')
            })
    })
}

/** Read sav or SPSS files */
function ReadFileWithPythonScript(username, fileName, sourceFilePath) {
    return new Promise((resolve, reject) => {

        /** Construct destination file path of JSON to be created */
        let DestinationFilePath = path.join(constants.AppUploadsDir, constants.AppJSONFilesDir, username),
            JSONFileName = fileName + '.json'

        /** Check and create directories with permissions */
        require('fs-extra').ensureDir(DestinationFilePath, 0o2775, (err) => {
            if (err) {
                logger.error('ReadFileWithPythonScript: ' + err)
                return reject('ReadFileWithPythonScript: ' + err)
            }

            let DestFilePath = path.join(DestinationFilePath, JSONFileName)

            /** Execute python program of reading SAV files and generate JSON file on above destination path */
            require('child_process').exec(constants.SAVFileReaderFile + ' "' + sourceFilePath + '" "' + DestFilePath + '"', (err) => {
                if (err) {
                    logger.error('ReadFileWithPythonScript: ' + err)
                    return reject('ReadFileWithPythonScript: ' + err)
                }

                /** Read and return data from JSON file */
                require('fs-extra').readFile(DestFilePath, (error, fileBuffer) => {
                    if (error) {
                        logger.error('ReadFileWithPythonScript: ' + err)
                        return reject('ReadFileWithPythonScript: ' + err)
                    }

                    try {
                        resolve(JSON.parse(fileBuffer))
                    } catch (err) {
                        logger.error('ReadFileWithPythonScript: ' + err)
                        return reject('ReadFileWithPythonScript: ' + err)
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

            case '.xls':
                filePath = path.join(constants.AppUploadsDir, constants.AppXLSFilesDir, username)
                break

            case '.xlsx':
                filePath = path.join(constants.AppUploadsDir, constants.AppXLSFilesDir, username)
                break

            case '.csv':
                filePath = path.join(constants.AppUploadsDir, constants.AppCSVFilesDir, username)
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

function LogUploadsToDatabase(userId, fileDataObj) {
    database.FindInCollection({
        username: userId
    }, constants.UploadsCollection, (data) => {
        let DBQuery = null
        if (data == null || data.length == 0) {
            // Add new document
            /** Query selector */
            switch (fileDataObj.fileType) {
                case '.sav':
                    DBQuery = [{
                        username: userId,
                        lastupload: new Date().toISOString(),
                        uploads: {
                            sav: [fileDataObj],
                            xls: [],
                            json: [],
                            csv: []
                        }
                    }]
                    break

                case '.xls':
                    DBQuery = [{
                        username: userId,
                        lastupload: new Date().toISOString(),
                        uploads: {
                            sav: [],
                            xls: [fileDataObj],
                            json: [],
                            csv: []
                        }
                    }]
                    break

                case '.xlsx':
                    DBQuery = [{
                        username: userId,
                        lastupload: new Date().toISOString(),
                        uploads: {
                            sav: [],
                            xls: [fileDataObj],
                            json: [],
                            csv: []
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
                            json: [fileDataObj],
                            csv: []
                        }
                    }]
                    break

                case '.csv':
                    DBQuery = [{
                        username: userId,
                        lastupload: new Date().toISOString(),
                        uploads: {
                            sav: [],
                            xls: [],
                            json: [],
                            csv: [fileDataObj]
                        }
                    }]
                    break

                default:
                    DBQuery = [{
                        username: userId,
                        lastupload: new Date().toISOString(),
                        uploads: {
                            sav: [],
                            xls: [],
                            json: [],
                            csv: [],
                            other: [fileDataObj]
                        }
                    }]
            }

            database.InsertManyDocuments(DBQuery, constants.UploadsCollection, (err) => {
                if (err == null) {
                    logger.error('LogUploadsToDatabase: Cannot Insert Document')
                }
            })

        } else {
            // Update current document
            /** Query selector */
            switch (fileDataObj.fileType) {
                case '.sav':
                    DBQuery = {
                        $push: {
                            'uploads.sav': fileDataObj.filePath
                        }
                    }
                    break

                case '.xls':
                    DBQuery = {
                        $push: {
                            'uploads.xls': fileDataObj.filePath
                        }
                    }
                    break

                case '.xlsx':
                    DBQuery = {
                        $push: {
                            'uploads.xls': fileDataObj.filePath
                        }
                    }
                    break

                case '.json':
                    DBQuery = {
                        $push: {
                            'uploads.json': fileDataObj.filePath
                        }
                    }
                    break

                case '.csv':
                    DBQuery = {
                        $push: {
                            'uploads.csv': fileDataObj.filePath
                        }
                    }
                    break

                default:
                    DBQuery = {
                        $push: {
                            'uploads.other': fileDataObj.filePath
                        }
                    }
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