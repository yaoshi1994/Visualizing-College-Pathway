import React, {PropTypes} from 'react';
import PageBase from '../components/PageBase';

// const Aboutpage = () => {
//
//   const styles = {
//     pic1: {
//       backgroundImage:  "url('../images/material_bg.png')"
//     }
//   }
//   return (
//     <PageBase title="About Us"
//               navigation="Application / About Us">
//               <p>
//               This project for CS5150. The basic idea of our project is to use the data mining and
//               visualize technology to analyze the enrollment data collected by the college administration
//               office to help the undergraduate student choose classes. We hope you enjoy our website!
//               if you have any question please contact us.
//               </p>
//
//
//     </PageBase>
//   );
// };


import {cyan600, pink600, purple600, orange600,grey600} from 'material-ui/styles/colors';
import Assessment from 'material-ui/svg-icons/action/assessment';
import Face from 'material-ui/svg-icons/action/face';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ShoppingCart from 'material-ui/svg-icons/action/shopping-cart';
import InfoBox from '../components/dashboard/InfoBox';
import NewOrders from '../components/dashboard/NewOrders';
import MonthlySales from '../components/dashboard/MonthlySales';
import BrowserUsage from '../components/dashboard/BrowserUsage';
import RecentlyProducts from '../components/dashboard/RecentlyProducts';
import globalStyles from '../styles';
import Data from '../data';

const Aboutpage = () => {
  const styles = {
    text: {
      fontSize: 25,
      marginLeft: 15,
      padding: 40,
      color:grey600
    },
    title: {
      marginTop: 80,
      merginLeft: 20,
      color:grey600,
      fontSize: 40
    },
    rowStyle: {
      marginLeft: 40,
      padding: 10
    },
    picStyle: {
      marginLeft: 100
    }
  };
  const pic1 = require('../images/pic1.png');
  const pic2 = require('../images/pic2.png')
  const pic3 = require('../images/pic3.png')

  return (
    <div>
      <p style={styles.title}> About Us </p>
      <h3 style={globalStyles.navigation}>Application / Dashboard</h3>

      <div className="row" style={styles.rowStyle}>
          <p style = {styles.text}>
              This project for CS5150. The basic idea of our project is to use the data mining and
              visualize technology to analyze the enrollment data collected by the college administration
              office to help the undergraduate student choose classes. We hope you enjoy our website!
              if you have any question please contact us.
              </p>
      </div>
      <div className="row">

        <div className="col-xs-16 col-sm-16 col-md-16 col-lg-16 m-b-15" style={styles.picStyle}>
          <img src={pic3}/>
        </div>




      </div>
    </div>
  );
};


export default Aboutpage;
