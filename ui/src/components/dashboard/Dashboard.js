import React, { Component } from 'react';

import BarChart from './Charts/BarChart'

class Dashboard extends Component {
    constructor(props){
      super(props);
      this.state = {
      };
    };

    render() {
        return (
           <BarChart />
        )
    }
}

export default Dashboard