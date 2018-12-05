const express = require('express'),
    app = express(),
    cookieSession = require('cookie-session'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    middleware = require('../helpers/middleware'),
    constants = require('../common/constant'),
    logger = require('../common/logger').logger,
    LocalStrategy = require('passport-local').Strategy

/** DUMMY DATA */
let users = [{
        id: 1,
        name: "Jude",
        email: "user@email.com",
        password: "password"
    },
    {
        id: 2,
        name: "Emma",
        email: "emma@email.com",
        password: "password2"
    }
]

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
        name: 'analytics-dashboard-session',
        keys: ['iamniceanalyserthatlovestoanalyzepieceofshit'],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }))

    app.use(passport.initialize());

    app.use(passport.session());

    /** Initiate passport authentication strategy */
    passport.use(
        new LocalStrategy({
                usernameField: "email",
                passwordField: "password"
            },

            (username, password, done) => {
                let user = users.find((user) => {
                    return user.email === username && user.password === password
                })

                if (user) {
                    done(null, user)
                } else {
                    done(null, false, {
                        message: 'Incorrect username or password'
                    })
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        let user = users.find((user) => {
            return user.id === id
        })

        done(null, user)
    })

    app.listen(constants.ServerPort, () => {
        logger.info("Analytics Server Started on port: " + constants.ServerPort)
    })
}