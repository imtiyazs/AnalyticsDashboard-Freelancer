const constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    path = require('path')

exports.UploadAndReadFile = (req, res) => {
    return new Promise((resolve, reject) => {

        /** Extract all required data from Headers and Multer Middleware */
        let fileType = path.extname(String(req.file.originalname)),
            filename = String(req.file.originalname),
            userid = String(req.headers.id),
            fileBuffer = req.file.buffer

        /**Create Require directory structure and return folder path */
        FileHandler(userid, fileType)
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
                            ReadSAVFiles(userid, filename, filePath)
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
function ReadSAVFiles(id, fileName, sourceFilePath) {
    return new Promise((resolve, reject) => {

        /** Construct destination file path of JSON to be created */
        let DestinationFilePath = path.join(constants.AppUploadsDir, constants.AppJSONFilesDir, id),
            JSONFileName = fileName + '.json'

        /** Check and create directories with permissions */
        require('fs-extra').ensureDir(DestinationFilePath, 0o2775, (err) => {
            if (err) {
                logger.error('ReadSAVFiles: ' + err)
                return reject()
            }

            let DestFilePath = path.join(DestinationFilePath, JSONFileName)

            /** Execute python program of reading SAV files and generate JSON file on above destination path */
            require('child_process').exec(constants.SAVFileReaderFile + ' ' + sourceFilePath + ' ' + DestFilePath, (err) => {
                if (err) {
                    logger.error('ReadSAVFiles: ' + err)
                    return reject()
                }

                /** Read and return data from JSON file */
                require('fs-extra').readFile(DestFilePath, (error, fileBuffer) => {
                    if (error) {
                        logger.error('ReadSAVFiles: ' + err)
                        return reject()
                    }

                    try {
                        resolve(JSON.parse(fileBuffer))
                    } catch (err) {
                        logger.error('ReadSAVFiles: ' + err)
                        return reject()
                    }
                })
            })
        })
    })
}

/** Create and ensure file paths */
function FileHandler(id, fileType) {
    return new Promise((resolve, reject) => {

        let filePath = path.join(constants.AppUploadsDir, constants.AppOTHERFilesDir, id)

        switch (fileType) {
            case '.sav':
                filePath = path.join(constants.AppUploadsDir, constants.AppSavFilesDir, id)
                break
        }

        require('fs-extra').ensureDir(filePath, 0o2775, (err) => {
            if (err) {
                logger.error('FileHandler: ' + err)
                reject()
            }
            resolve(filePath)
        })
    })
}