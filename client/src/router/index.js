import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')
const Profile = () => import('@/views/Profile')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')
const DownloadReports = () => import('@/views/pages/DownloadReports')
const ReportAnalysis = () => import('@/views/pages/ReportAnalysis')
const ReportHistory = () => import('@/views/pages/ReportHistory')
const ServerInformation = () => import('@/views/pages/ServerInformation')
const UserManagement = () => import('@/views/pages/UserManagement')
const Announcement = () => import('@/views/pages/Announcement')

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [{
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [{
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/downloadreports',
          name: 'Download Reports',
          component: DownloadReports
        },
        {
          path: '/reportanalysis',
          name: 'Report Analysis',
          component: ReportAnalysis
        },
        {
          path: '/reporthistory',
          name: 'Report History',
          component: ReportHistory
        },
        {
          path: '/profile',
          name: 'Profile',
          component: Profile
        },
        {
          path: '/server',
          name: 'Server Information',
          component: ServerInformation
        },
        {
          path: 'admin/user-mgmt',
          name: 'User Management',
          component: UserManagement
        },
        {
          path: 'admin/announcement',
          name: 'Dashboard Announcements',
          component: Announcement
        }
      ]
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]

})
