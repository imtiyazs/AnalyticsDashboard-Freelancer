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
    database = require('../database/database')

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
                    user: info
                })
            })
        })(req, res, next)
    })

    /** Register User API */
    app.post(constants.RegisterRoute, (req, res) => {
        logger.info(constants.RegisterRoute)
        loginRegister.RegisterNewUser(req.body)
            .then(() => {
                res.status(200).send('User Registration Successful')
            })
            .catch(err => {
                res.status(417).send('User Registration Failed: ' + err)
            })
    })

    /** Logout API */
    app.get(constants.LogoutRoute, function (req, res) {
        logger.info(constants.LogoutRoute)
        req.logout()
        return res.status(200).send('Logout successful');
    });

    /** User API to check user is logged */
    app.get(constants.UserRoute, middleware.authMiddleware, (req, res) => {
        logger.info(constants.UserRoute)
        let user = users.find(user => {
            return user.id === req.session.passport.user
        })
        res.status(200).send({
            user: user
        })
    })
}

function InitializeServerConfigurations() {

    // Attach body parser to read data from ajax calls
    app.use(bodyParser.json())

    // Set Browser Cookies
    app.use(cookieSession({
        name: constants.CookieName,
        keys: [constants.CookieKey],
        maxAge: constants.UserTTL
    }))

    app.use(passport.initialize());

    app.use(passport.session());

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
        user.forEach(user => {
            done(null, user._id)
        })
    })

    passport.deserializeUser((id, done) => {
        database.FindInCollection({
            _id: id
        }, constants.UsersCollection, (data) => {
            data.forEach(user => {
                if (user._id === id) {
                    done(null, user)
                }
            })

            done(null, false)
        })

    })

    app.listen(constants.ServerPort, () => {
        logger.info("Analytics Server Started on port: " + constants.ServerPort)
    })
}