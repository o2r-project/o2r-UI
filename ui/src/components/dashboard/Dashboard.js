import React, { Component } from 'react';

import BarChart from './Charts/BarChart'
import PieChart from './Charts/PieChart'
import LineChart from './Charts/LineChart'

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

    </>
    )
  }
}

export default Dashboard