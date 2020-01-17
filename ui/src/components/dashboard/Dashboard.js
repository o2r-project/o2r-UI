import React, { Component } from 'react';

import BarChart from './Charts/BarChart'
import PieChart from './Charts/PieChart'

class Dashboard extends Component {
    constructor(props){
      super(props);
      this.state = {
      };
    };

    render() {
        return (<>
           <BarChart />
           <PieChart />
           </>
        )
    }
}

export default Dashboard