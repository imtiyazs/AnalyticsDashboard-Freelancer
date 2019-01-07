let SAVFileReaderFile = null

/** Platform based executable path */
switch (process.platform) {
    case 'win32':
        SAVFileReaderFile = '..\\savReader\\main.py' // Command to execute python script to read files: DEVELOPMENT
        break
    default:
        SAVFileReaderFile = 'python2 ../savReader/main.py' // Command to execute python script to read files: PRODUCTION
}

module.exports = constants = {

    /** Server Configuration */
    ServerPort: 9449, // Server port
    AppLogFile: './server.log', // Server log path
    AppUploadsDir: 'Uploads', // Server Uploads folder
    AppSavFilesDir: 'SAV',
    AppXLSFilesDir: 'XLS',
    AppJSONFilesDir: 'JSON',
    AppCSVFilesDir: 'CSV',
    AppOTHERFilesDir: 'OTHER',
    SAVFileReaderFile: SAVFileReaderFile, // Export command path to variable

    /** Database */
    DBServerAddress: 'localhost', // MongoDB Host address
    DBServerPort: 27017, // MongoDB Port
    BcryptSaltRounds: 12, // Salt rounds to be performed while encrypting a password
    DBName: 'AnalyticsDashboard', // Database Name
    AnnouncementCollection: 'Announcements', // Announcement Collection - DEPRECATED IN FUNCTIONALITY
    UsersCollection: 'Users', // Users collection: Contains all user data
    ReportsCollection: 'Reports', // Reports Collection: Contains all reports data that are generated after uploading
    SessionsCollection: 'Sessions', // Sessions Collection: DEPRECATED IN FUNCTIONALITY
    UploadsCollection: 'Uploads', // Uploads Collection: Contains all records of uploaded files and paths
    TrashCollection: 'Trash', // Trash Collection: DEPRECATED IN FUNCTIONALITY
    DefaultRootUser: 'admin', // Default super admin User
    DefaultRootPassword: 'admin', // Default super admin password
    WelcomeMessage: 'Welcome To Analytics Reports Dashboard!', // Default announcement - DEPRECATED

    /** Session and API Configuration */
    CookieName: 'analytics-dashboard-session', // Cookie name to be stored in browser
    CookieKey: 'iamniceanalyserthatlovestoanalyzepieceofshit', // Cookie key for security
    UserTTL: 2 * 60 * 60 * 1000, // 2 hours: For user session expiration

    /** API Routes */
    RootRoute: '/', // Root i.e. domain.com 
    LoginRoute: '/o/login', // Login API
    LogoutRoute: '/o/logout', // Logout API
    RegisterRoute: '/o/register', // Register API
    UserRoute: '/o/user', // User session check API
    DashboardRoute: '/o/getdashboardstats', // Fetch Dashboard details API
    FilesUploadRoute: '/o/uploadfiles', // Upload files API for report analysis
    ProfileRoute: '/o/profile', // Fetch user profile API
    ReportUploadRoute: '/o/uploadreport', // Upload final report API after report generation
    ReportHistoryRoute: '/o/reporthistory', // Fetch Report History API
    GetUsersRoute: '/o/getusers', // Get User list API for superadmin
    UserMgmtRoute: '/o/user-mgmt', // User management API for superadmin
    AnnounceRoute: '/o/announce' // Create announcement API for superadmin
}