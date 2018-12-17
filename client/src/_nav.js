export default {
  items: [{
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
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
      name: 'Account',
      url: '#',
      icon: 'icon-user',
      children: [{
        name: 'Profile',
        url: '/profile',
        icon: 'icon-emotsmile'
      }]
    }
  ]
}
