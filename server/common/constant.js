let SAVFileReaderFile = null

/** Platform based executable path */
switch (process.platform) {
    case 'win32':
        SAVFileReaderFile = '..\\savReader\\main.py'
        break
    default:
        SAVFileReaderFile = 'python3 ../savReader/main.py'
}

module.exports = constants = {

    /** Server Configuration */
    ServerPort: 9449,
    AppLogFile: './server.log',
    AppUploadsDir: 'Uploads',
    AppSavFilesDir: 'SAV',
    AppXLSFilesDir: 'XLS',
    AppJSONFilesDir: 'JSON',
    AppCSVFilesDir: 'CSV',
    AppOTHERFilesDir: 'OTHER',
    SAVFileReaderFile: SAVFileReaderFile,

    /** Database */
    DBServerAddress: 'localhost',
    DBServerPort: 27017,
    BcryptSaltRounds: 12,
    DBName: 'AnalyticsDashboard',
    AnnouncementCollection: 'Announcements',
    UsersCollection: 'Users',
    ReportsCollection: 'Reports',
    SessionsCollection: 'Sessions',
    UploadsCollection: 'Uploads',
    TrashCollection: 'Trash',
    DefaultRootUser: 'admin',
    DefaultRootPassword: 'admin',
    WelcomeMessage: 'Welcome To Analytics Reports Dashboard!',

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
    DashboardRoute: '/o/getdashboardstats',
    FilesUploadRoute: '/o/uploadfiles',
    ProfileRoute: '/o/profile',
    ReportUploadRoute: '/o/uploadreport',
    ReportHistoryRoute: '/o/reporthistory',
    GetUsersRoute: '/o/getusers',
    UserMgmtRoute: '/o/user-mgmt'
}