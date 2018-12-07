module.exports = constants = {

    /** Server Configuration */
    ServerPort: 9449,
    AppLogFile: './server.log',

    /** Database */
    DBServerAddress: '10.2.10.160',
    DBServerPort: 27017,
    BcryptSaltRounds: 12,
    DBName: 'AnalyticsDashboard',
    UsersCollection: 'Users',
    ReportsCollection: 'Reports',
    SessionsCollection: 'Sessions',

    /** Session and API Configuration */
    CookieName: 'analytics-dashboard-session',
    CookieKey: 'iamniceanalyserthatlovestoanalyzepieceofshit',
    UserTTL: 2 * 60 * 60 * 1000, // 2 hours

    /** API Routes */
    RootRoute: '/',
    LoginRoute: '/o/login',
    LogoutRoute: '/o/logout',
    RegisterRoute: '/o/register',
    UserRoute: '/o/user',
    DashboardRoute: '/o/getdashboardstats'
}