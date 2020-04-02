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
          <h1>Create your own Executable Research Compendium (ERC)</h1>
            <div style={{width:"65%", marginLeft: "auto", marginRight: "auto"}}>
              <div className="instruction">
                <b>Step 1: Create an R Markdown file including your R analysis</b>
              </div>
              <div className="instruction">
                <b>Step 2: Add metadata to your RMarkdown in YAML format like <a target="_blank" rel="noopener" href="https://github.com/o2r-project/erc-examples/blob/master/ERC/Finished/INSYDE/workspace/main.Rmd">here</a>
                </b><br/>
              </div>
              <div className="instruction">
                <b>Step 3: Run your R Markdown to generate the HTML file</b><br/>
              </div>
              <div className="instruction">
                <b>Step 4: Upload your workspace including the code files, data, and the HTML (.zip)</b><br/>
              </div>
              <div className="instruction">
                <b>No workspace at hand? Just upload one of our <a target="_blank" rel="noopener" href="https://github.com/o2r-project/erc-examples/tree/master/ERC/Finished">example ERCs</a></b>
              </div>
              <Dropzone />
            </div>
        </div>
        <InspectExamples />
      </div>
    );
  }
}

export default Startpage;