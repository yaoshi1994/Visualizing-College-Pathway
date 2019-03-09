import React from 'react';
import {cyan600, pink600, purple600, orange600, transparent,white} from 'material-ui/styles/colors';
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
import StartHere from '../components/dashboard/StartHere';
import Styles from '../styles'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';

var sectionStyle = {
  width: "100%",
  height: "900px",
  backgroundImage: "url('../images/back.png')",
  backgroundSize: 'cover'

};
const styles = {
  // toggleDiv: {
  //   maxWidth: 300,
  //   marginTop: 40,
  //   marginBottom: 5
  // },
  // toggleLabel: {
  //   color: grey400,
  //   fontWeight: 100
  // },
  buttons: {
    marginTop: 100,
    width: 250,
    height: 50
  },
  buttonsDiv: {
    // textAlign: 'center',
    padding: 80
  },
};

const DashboardPage = () => {

  return (
    <div style={sectionStyle}>
      <div className="text-center">
        <div className="col-md-9 col-md-offset-5">
          <StartHere/>
          <div style={styles.buttonsDiv}>

          <Link to="/visualize">
            <FlatButton label="Start Here"
                          primary={true}
                          backgroundColor="transparent"
                          labelStyle = {{ fontSize: 30,color: white}}
                          style={styles.buttons}/>
          </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
