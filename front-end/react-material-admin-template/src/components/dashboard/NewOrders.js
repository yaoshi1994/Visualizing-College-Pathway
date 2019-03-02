import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import {white, purple600, purple500} from 'material-ui/styles/colors';
import {LineChart, Line, ResponsiveContainer} from 'recharts';
import {typography} from 'material-ui/styles';

const NewOrders = (props) => {

  const styles = {
    paper: {
      backgroundColor: purple500,
      height: 150
    },
    div: {
      height: 95,
      padding: '5px 15px 0 15px'
    },
    header: {
      fontSize: 70,
      fontWeight: typography.fontWeightLight,
      color: white,
      backgroundColor: purple600,
      padding: 20,
    }
  };

  return (
    <Paper style={styles.paper}>
      <div style={{...styles.header}}>Start Here</div>
      <div style={styles.div}>
      </div>
    </Paper>
  );
};

NewOrders.propTypes = {
  data: PropTypes.array
};

export default NewOrders;
