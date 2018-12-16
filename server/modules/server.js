const express = require('express'),
    app = express(),
    cookieSession = require('cookie-session'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    middleware = require('../helpers/middleware'),
    constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    loginRegister = require('./login-register'),
    LocalStrategy = require('passport-local'),
    fileReader = require('./file-reader'),
    database = require('../database/database'),
    dashboard = require('./dashboard'),
    multer = require('multer'),
    userMgmt = require('./user-management'),
    reports = require('./report-writer'),
    upload = multer({
        storage: multer.memoryStorage()
    })

/** Start express server */
exports.StartApplicationServer = () => {

    /** Initialize Server */
    InitializeServerConfigurations()

    /** Root API */
    app.get(constants.RootRoute, (req, res) => {
        logger.info(constants.RootRoute)
        res.status(200).send('Server is online')
    })

    /** Login API */
    app.post(constants.LoginRoute, (req, res, next) => {
        logger.info(constants.LoginRoute)
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                logger.error('passport.authenticate: ' + err)
                return res.status(400).send('Server error While Logging In');
            }

            if (!user) {
                return res.status(400).send('Incorrect Username/Password')
            }

            req.login(user, err => {
                if (err) {
                    logger.error('Login Route: ' + err)
                    return res.status(400).send('Incorrect Username/Password')
                }

                return res.status(200).send({
                    message: 'User Logged In Successfully',
                    user: user
                })
            })
        })(req, res, next)
    })

    /** Profile API */
    app.post(constants.ProfileRoute, (req, res) => {
        logger.info(constants.ProfileRoute)
        userMgmt.UserProfileOperation(req.body)
            .then(data => {
                return res.status(200).send(data)
            })
            .catch(err => {
                return res.status(417).send(err)
            })
    })

    /** Register User API */
    app.post(constants.RegisterRoute, (req, res) => {
        logger.info(constants.RegisterRoute)
        loginRegister.RegisterNewUser(req.body)
            .then(() => {
                res.status(200).send('Registration Successful!')
            })
            .catch(err => {
                res.status(417).send(err)
            })
    })

    /** Logout API */
    app.get(constants.LogoutRoute, function (req, res) {
        logger.info(constants.LogoutRoute)
        req.logout()
        return res.status(200).send('Logout successful');
    });

    /** Update Final Reports to Database */
    app.post(constants.ReportUploadRoute, (req, res) => {
        logger.info(constants.ReportUploadRoute)
        reports.CheckAndWriteReports(req.body)
            .then(() => {
                return res.status(200).send(true)
            })
            .catch(() => {
                return res.status(417).send(false)
            })
    })

    /** Read and extract uploaded files */
    app.post(constants.FilesUploadRoute, upload.single('file'), (req, res) => {
        logger.info(constants.FilesUploadRoute)
        fileReader.UploadAndReadFile(req, res)
            .then(JSONfiledata => {
                return res.status(200).send(JSONfiledata)
            })
            .catch(err => {
                return res.status(417).send(err)
            })
    })

    /** Dashboard statistics route */
    app.post(constants.DashboardRoute, (req, res) => {
        logger.info(constants.DashboardRoute)
        dashboard.GetDashboardStatistics(req)
            .then(JSONfiledata => {
                return res.status(200).send(JSONfiledata)
            })
            .catch(err => {
                return res.status(417).send(err)
            })
    })

    /** User API to check user is logged */
    app.post(constants.UserRoute, middleware.authMiddleware, (req, res) => {
        logger.info(constants.UserRoute)
        database.FindByObjectID(req.session.passport.user, constants.UsersCollection, (data) => {
            if (data == null) {
                return res.status(417).send('Session Expired')
            }

            if (String(data._id).toLowerCase() === String(req.session.passport.user).toLowerCase()) {
                return res.status(200).send(data)
            } else {
                return res.status(417).send('Session Expired')
            }
        })
    })
}

function InitializeServerConfigurations() {

    // Attach body parser to read data from ajax calls
    app.use(bodyParser.urlencoded({
        json: {
            limit: '50mb',
            extended: true
        },
        urlencoded: {
            limit: '50mb',
            extended: true
        },
        extended: true
    }));
    app.use(bodyParser.json());

    // Set Browser Cookies
    app.use(cookieSession({
        name: constants.CookieName,
        keys: [constants.CookieKey],
        maxAge: constants.UserTTL
    }))

    // app.use(session({
    //     secret: constants.CookieKey,
    //     saveUninitialized: true,
    //     resave: true,
    //     // using store session on MongoDB using express-session + connect
    //     store: new MongoStore({
    //         url: 'mongodb://' + constants.DBServerAddress + ':' + constants.DBServerPort,
    //         collection: constants.SessionsCollection
    //     })
    // }))

    app.use(passport.initialize())

    app.use(passport.session())

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:9449')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept')
        res.header('Access-Control-Allow-Credentials', true)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        next()
    })

    /** Initiate passport authentication strategy */
    passport.use(
        new LocalStrategy({
            usernameField: "username",
            passwordField: "password"
        }, (username, password, done) => {
            loginRegister.UserLogin(username, password)
                .then(user => {
                    if (user) {
                        done(null, user)
                    } else {
                        done(null, false, {
                            message: 'Incorrect username or password'
                        })
                    }

                    return user
                })
                .catch(err => {
                    done(null, false, {
                        message: err
                    })
                })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        database.FindByObjectID(id, constants.UsersCollection, (validatedUserData) => {
            done(null, validatedUserData)
        })
    })

    app.listen(constants.ServerPort, () => {
        logger.info("Analytics Server Started on port: " + constants.ServerPort)
    })
}