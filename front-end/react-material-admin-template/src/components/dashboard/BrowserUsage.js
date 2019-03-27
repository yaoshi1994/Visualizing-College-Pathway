import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import {white, purple600, red900,grey400} from 'material-ui/styles/colors';
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

class BrowserUsage extends React.Component {
// const BrowserUsage = (props) => {
constructor (props) {
  super(props);
}

handleChange(evt) {
  const target = evt.target;
  const name = target.textContent;
  switch(name) {
  case "Information Science":
    // code block
    console.log(name);
    break;
  case  "Computer Science":
    // code block
    console.log(name);
    break;
  default:
    // code block
    console.log(typeof name);
    break;
  }
}

render(){

  const styles = {
    paper: {
      backgroundColor: red900,
      minHeight: 300,
      padding: 30,
      marginLeft: 0,
      marginTop: 50,
      width: 400
    },
    pieChartDiv: {
      height: 300,
      textAlign: 'left',
      padding:15,
      marginBottom: 30
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
      marginLeft:15,

    }
  };

  const MAJOR_ITEMS = ['Computer Science', 'Information Science', 'Statistics Science'];



    return (
      <Paper style={styles.paper}>

        <div style={GlobalStyles.clear}/>
        <div className="row">
            <div style={styles.pieChartDiv}>
              <p style={styles.textStyle}> Explore majors and find courses by seeing the choices of previous students.</p>
              <p style={styles.textStyle}>Pick a major:  </p>

              <SelectField
                id= "select-major"
                floatingLabelText="Computer Sciennce"
                floatingLabelStyle={{color: 'white'}}
                className="md-cell"
                fullWidth={true}
                value=""
                onChange={this.handleChange}>
                <MenuItem key={0}  primaryText="Computer Science"/>
                <MenuItem key={1}  primaryText="Information Science"/>
                <MenuItem key={2}  primaryText="Statistics Science"/>
              </SelectField>
            </div>
        </div>
      </Paper>
    );
  };
}

BrowserUsage.propTypes = {
  data: PropTypes.array
};

export default BrowserUsage;
