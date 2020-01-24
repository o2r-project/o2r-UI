import React, { Component } from 'react';

import BarChart from './Charts/BarChart'
import PieChart from './Charts/PieChart'
import LineChart from './Charts/LineChart'
import OwnMap from './Map/OwnMap';
import './dashboard.css'
import {Grid } from '@material-ui/core'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  render() {
    return (<>
    <Grid container spacing={2}>
        <Grid item xs={3}>
          <BarChart />
        </Grid>
        <Grid item xs={6}>
         <PieChart />
        </Grid>
        <Grid item xs ={3} >
         <LineChart />
        </Grid>
        <Grid item xs ={3}>
          <Grid container  spacing={1} direction="column" style={{height: "60vh"}}>
            <Grid item style={{width:"100%"}}>
             <LineChart />
            </Grid>
            <Grid item>
             <PieChart />
            </Grid>
           </Grid>
        </Grid>
        <Grid item xs={6} style={{height: "60vh"}}>
        <OwnMap/>
        </Grid>
        <Grid item xs ={3}>
          <Grid container spacing={1}  direction="column" style={{height: "60vh"}}>
          <Grid item>
             <BarChart />
            </Grid>
            <Grid item>
             <PieChart />
            </Grid>
           </Grid>
        </Grid>
        </Grid>    
    </>
    )
  }
}

export default Dashboard