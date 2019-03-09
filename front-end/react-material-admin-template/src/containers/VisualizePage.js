import React, {PropTypes} from 'react';
import PageBase from '../components/PageBase';
// import D3tip from '../d3-tip';
import * as d3 from '../d3.min';
import * as Diagram from '../Diagram';
import Data from '../data';
import BrowserUsage from '../components/dashboard/BrowserUsage';
import globalStyles from '../styles';



const VisualizePage = () => {

  Diagram.showDiagram(d3)

  // return (
  //   <PageBase title="visualize"
  //             navigation="Application / Visulize">
  //   </PageBase>
  // );

  return (
    <div>
      <h3 style={globalStyles.navigation}>Application / Visulize</h3>
       <script src="../Diagram.js"> </script>

        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
          <BrowserUsage data={Data.dashBoardPage.browserUsage}/>

        </div>
      </div>
  );
};

export default VisualizePage;
