import React, { Component } from "react";

import './startpage.css';
import InspectExamples from '../inspectExamplesDemo/InspectExamples';

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