import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import {white, grey600, purple500,transparent} from 'material-ui/styles/colors';
import {LineChart, Line, ResponsiveContainer} from 'recharts';
import {typography} from 'material-ui/styles';

const StartHere = (props) => {

  const styles = {
    paper: {
      backgroundColor: 'transparent',
      height: 300,
      boxShadow: 0
    },
    div: {
      height: 250,
      padding: '5px 15px 0 15px',
      backgroundColor: 'transparent'
    },
    header: {
      fontSize: 70,
      fontWeight: typography.fontWeight,
      color: white,
      backgroundColor: 'transparent',
      padding: 30,
    }
  };

  return (
    <Paper style={styles.paper}>
      <div style={styles.div}></div>
      <div style={{...styles.header}}>College Pathway </div>
      <div style={{...styles.header}}>Visualization </div>
    </Paper>
  );
};

StartHere.propTypes = {
  data: PropTypes.array
};

export default StartHere;
