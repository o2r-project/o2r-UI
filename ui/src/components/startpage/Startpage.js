import React, { Component } from "react";
import { Card, CardContent, Grid } from "@material-ui/core/";

import './startpage.css';
import Upload from "../uploadERC/Upload";
import InspectExamples from '../inspectExamples/InspectExamples';

class Startpage extends Component {
  state = {
    spacing: "10"
  };

  render() {
    const { spacing } = this.state;

    return (
      <Grid container spacing={10}>
<<<<<<< HEAD
        <Grid item xs={12}>
          <Grid
            container
            justify="center"
            spacing={Number(spacing)}>
              <Grid item>
                <Card id="uploadCard1">
                  <CardContent>
                      <Upload />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card id="uploadCard2">    
                  <CardContent>
                      <InspectExamples />
                  </CardContent>
                </Card>
              </Grid>
          </Grid>
          <p id="moreInfo">Find more information on our project website <a href="https://o2r.info">https://o2r.info</a></p>
=======
      <Grid item xs={12}>
        <Grid
          container
          justify="center"
          spacing={Number(spacing)}>
            <Grid item>
            <Card id="uploadCard1">
              <CardContent>
                  <Upload></Upload>
              </CardContent>
            </Card>
            </Grid>
            <Grid item>
            <Card id="uploadCard2">    
            <CardContent>
                <InspectExamples></InspectExamples>
            </CardContent>
            </Card>
            </Grid>
>>>>>>> dev
        </Grid>
        <p id="moreInfo">Find more information on our project website <a href="https://o2r.info">https://o2r.info</a></p>
      </Grid>
    </Grid>
    );
  }
}

export default Startpage;
