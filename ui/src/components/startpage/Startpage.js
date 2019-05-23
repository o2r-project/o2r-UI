import React, { Component } from "react";
import { Grid, Card, CardContent } from "@material-ui/core/";

import './startpage.css';
import Upload from "../uploadERC/Upload";
import InspectExamples from '../inspectExamples/InspectExamples';

class Startpage extends Component {
  state = {
    spacing: "40"
  };

  render() {
    const { spacing } = this.state;

    return (
      <Grid container spacing={40}>
        <Grid item xs={12}>
          <Grid
            container
            justify="center"
            spacing={Number(spacing)}>
              <Grid item>
              <Card id="uploadCard">
                <CardContent>
                    <Upload></Upload>
                </CardContent>
              </Card>
              </Grid>
              <Grid item>
              <Card id="uploadCard">    
              <CardContent>
                  <InspectExamples></InspectExamples>
              </CardContent>
              </Card>
              </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Startpage;
