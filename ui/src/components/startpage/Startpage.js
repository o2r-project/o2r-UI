import React, { Component } from "react";
import { Grid, Card, CardContent } from "@material-ui/core/";

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
      <InspectExamples />
    );
  }
}

export default Startpage;
