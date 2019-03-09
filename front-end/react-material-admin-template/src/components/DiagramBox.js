import React, { PropTypes } from 'react';
import PageBase from '../components/PageBase';
// import D3tip from '../d3_tip';
import * as d3 from '../d3.min';
import * as Diagram from '../Diagram';
import Paper from 'material-ui/Paper';
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import GlobalStyles from '../../styles';

const DiagramBox = (props) => {

  const styles = {
    paper: {
      minHeight: 344,
      padding: 10
    },
    legend: {
      paddingTop: 20,
    },
    pieChartDiv: {
      height: 290,
      textAlign: 'center'
    }
  };

  return (
    <Paper style={styles.paper}>
      <span style={GlobalStyles.title}>Browser Usage</span>

      <div style={GlobalStyles.clear}/>

      <div className="row">

        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
          <div style={styles.pieChartDiv}>
            <ResponsiveContainer>
              <Diagram >
              </Diagram>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default DiagramBox;
