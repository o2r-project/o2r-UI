import React, { Component } from 'react';

import BarChart from './Charts/BarChart'
import PieChart from './Charts/PieChart'
import LineChart from './Charts/LineChart'
import OwnMap from './Map/OwnMap';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  render() {
    return (<>
      <BarChart />
      <PieChart />
      <LineChart />
      <OwnMap/>
    </>
    )
  }
}

export default Dashboard