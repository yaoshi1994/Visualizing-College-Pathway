import React, {PropTypes} from 'react';
import PageBase from '../components/PageBase';
// import D3tip from '../d3-tip';
import * as Diagram from '../Diagram';
import Data from '../data';
import BrowserUsage from '../components/dashboard/BrowserUsage';
import globalStyles from '../styles';
import * as d3 from '../d3.min';



const VisualizePage = () => {


    const styles = {
      d3pic: {
        marginLeft: 40
      }
    };
  return (
    <div>
      <h3 style={globalStyles.navigation}>Application / Visulize</h3>
      <div className='row'>
        <div id="vis_table" ></div>
          <div style={styles.d3pic}>

            {setTimeout(function(){Diagram.showDiagram(850,800)})}
            
            <BrowserUsage data={Data.dashBoardPage.browserUsage}/>

          </div>
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <h3 style={globalStyles.navigation}>Application / Visulize</h3>
  //       <div>
  //         {Diagram.showDiagram(1000,500)}
  //       </div>
  //       <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
  //
  //         <BrowserUsage data={Data.dashBoardPage.browserUsage}/>
  //       </div>
  //     </div>
  // );
};

export default VisualizePage;
