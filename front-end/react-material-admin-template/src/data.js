import React from 'react';
import Assessment from 'material-ui/svg-icons/action/assessment';
import GridOn from 'material-ui/svg-icons/image/grid-on';
import PermIdentity from 'material-ui/svg-icons/action/perm-identity';
import Web from 'material-ui/svg-icons/av/web';
import {cyan600, pink600, purple600} from 'material-ui/styles/colors';
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

const data = {
  menus: [
    { text: 'Home', icon: <Assessment/>, link: '/dashboard' },
    { text: 'Visualize', icon: <GridOn/>, link: '/visualize' },
    { text: 'Saved Path', icon: <Web/>, link: '/table' },
    { text: 'About', icon: <GridOn/>, link:  '/about'},
    { text: 'Contact us', icon: <PermIdentity/>, link: '/form' },
    { text: 'Login', icon: <PermIdentity/>, link: 'login' }
  ],
  tablePage: {
    items: [
      {id: 1, name: 'Pathway 1', date: '1/2/2019', category: 'Category 1'},
      {id: 2, name: 'Pathway 2', date: '2/3/2019', category: 'Category 2'},
      {id: 3, name: 'Pathway 3', date: '3/2/2019', category: 'Category 3'},
      {id: 4, name: 'Pathway 4', date: '4/2/2019', category: 'Category 4'},
      {id: 5, name: 'Pathway 5', date: '5/2/2019', category: 'Category 5'},
      {id: 6, name: 'Pathway 6', date: '6/2/2019', category: 'Category 6'},
      {id: 7, name: 'Pathway 7', date: '7/2/2019', category: 'Category 7'},
      {id: 8, name: 'Pathway 8', date: '8/2/2019', category: 'Category 8'}
    ]
  },
  dashBoardPage: {
    recentProducts: [
      {id: 1, title: 'Samsung TV', text: 'Samsung 32 1080p 60Hz LED Smart HDTV.'},
      {id: 2, title: 'Playstation 4', text: 'PlayStation 3 500 GB System'},
      {id: 3, title: 'Apple iPhone 6', text: 'Apple iPhone 6 Plus 16GB Factory Unlocked GSM 4G '},
      {id: 4, title: 'Apple MacBook', text: 'Apple MacBook Pro MD101LL/A 13.3-Inch Laptop'}
    ],
    monthlySales: [
      {name: 'Jan', uv: 3700},
      {name: 'Feb', uv: 3000},
      {name: 'Mar', uv: 2000},
      {name: 'Apr', uv: 2780},
      {name: 'May', uv: 2000},
      {name: 'Jun', uv: 1800},
      {name: 'Jul', uv: 2600},
      {name: 'Aug', uv: 2900},
      {name: 'Sep', uv: 3500},
      {name: 'Oct', uv: 3000},
      {name: 'Nov', uv: 2400},
      {name: 'Dec', uv: 2780}
    ],
    newOrders: [
      {pv: 2400},
      {pv: 1398},
      {pv: 9800},
      {pv: 3908},
      {pv: 4800},
      {pv: 3490},
      {pv: 4300}
    ],
    browserUsage: [
      {name: 'Chrome', value: 800, color: cyan600, icon: <ExpandMore/>},
      {name: 'Firefox', value: 300, color: pink600, icon: <ChevronRight/>},
      {name: 'Safari', value: 300, color: purple600, icon: <ExpandLess/>}
    ]
  }
};

export default data;
