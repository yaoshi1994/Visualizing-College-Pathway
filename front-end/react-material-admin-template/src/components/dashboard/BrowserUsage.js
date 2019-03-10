import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import {white, purple600, red900,grey400} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import GlobalStyles from '../../styles';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import PageBase from '../PageBase';


const BrowserUsage = (props) => {

  const styles = {
    paper: {
      backgroundColor: red900,
      minHeight: 600,
      padding: 30,
      marginLeft: 0,
      marginTop: 30,
      width: 400
    },
    pieChartDiv: {
      height: 400,
      textAlign: 'left',
      padding:15
    },
    textStyle: {
      color:white,
      fontSize: 27,
      marginLeft: 30,
      marginBottom:10,
    },
    titleStyle: {
      color:white,
      fontSize: 40,
      marginLeft:15
    }
  };

  return (
    <Paper style={styles.paper}>

      <span style={styles.titleStyle}>ABOUT</span>
      <div style={GlobalStyles.clear}/>
      <div className="row">
          <div style={styles.pieChartDiv}>
            <p style={styles.textStyle}> Please select a major to see all possible pathways to graduate
              from this major, Pathway is the "Foot Print" collected by students enrolled
              into this school in last five years ...</p>

            <SelectField
              floatingLabelText="Major"
              value=""
              fullWidth={true}>
              <MenuItem key={0} primaryText="Computer Science"/>
              <MenuItem key={1} primaryText="Information Science"/>
              <MenuItem key={2} primaryText="Statistics Science"/>
            </SelectField>
          </div>
      </div>
    </Paper>
  );
};

BrowserUsage.propTypes = {
  data: PropTypes.array
};

export default BrowserUsage;
