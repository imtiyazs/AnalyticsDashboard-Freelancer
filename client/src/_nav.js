export default {
  items: [{
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      name: 'Generate Report',
      url: '/generatereports',
      icon: 'icon-graph'
    },
    {
      name: 'Report Analysis',
      url: '/reportanalysis',
      icon: 'icon-pie-chart'
    },
    {
      name: 'Report History',
      url: '/reporthistory',
      icon: 'icon-magnifier'
    },
    {
      name: 'Download Reports',
      url: '/downloadreports',
      icon: 'icon-cloud-download'
    },
    {
      name: 'Account',
      url: '#',
      icon: 'icon-user',
      children: [{
          name: 'Profile',
          url: '/profile',
          icon: 'icon-emotsmile'
        }
      ]
    }
  ]
}
