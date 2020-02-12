import React, { Component } from "react";

import './startpage.css';
import InspectExamples from '../inspectExamplesDemo/InspectExamples';
import Dropzone from "../uploadERC/Dropzone/Dropzone";

class Startpage extends Component {
  state = {
    spacing: "10"
  };

  render() {
    const { spacing } = this.state;

    return (
      <div>
        <div style={{width:"50%", marginTop:"5%", marginLeft: "auto", marginRight: "auto"}}>
          <h1>Create your own Execuable Research Compendium (ERC)</h1>
            <div style={{width:"50%", marginLeft: "auto", marginRight: "auto"}}>
            <h3>Upload your workspace (.zip) or <a href="https://github.com/o2r-project/erc-examples/tree/master/ERC/Finished">use existing ones</a></h3>
              <Dropzone />
            </div>
        </div>
        <InspectExamples />
      </div>
    );
  }
}

export default Startpage;