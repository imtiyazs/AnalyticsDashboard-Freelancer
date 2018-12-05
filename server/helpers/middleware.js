/**
 * Authentication middleware to check user is logged on visit
 */
exports.authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).send('Unauthorized Access')
    } else {
        return next()
    }
}