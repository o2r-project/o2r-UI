import React, { Component } from "react";

import './startpage.css';
import httpRequests from '../../helpers/httpRequests';
import InspectExamples from '../inspectExamplesDemo/InspectExamples';
import Dropzone from "../uploadERC/Dropzone/Dropzone";
import { Grid, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';


class Startpage extends Component {
  state = {
    spacing: "10",
    value: "",
    progress: 0,
    open: false,
  };
  
  componentMounted() {
    console.log("mounted")
}

  submit = () => {
    let self= this;
    this.setState({open:true, progress: 30, title: "Retreving file from Zenodo"})
    httpRequests.uploadViaZenodo(this.state.value)
      .then((response) => {
        console.log(response);
        self.setState({open:true, progress: 50})
        var id= response.data.id
        var metadata= "";
        httpRequests
                .singleCompendium(response.data.id)
                .then(function(res) {
                  self.setState({open:true, progress: 80})
                    metadata=res.data.metadata
                    return httpRequests.updateMetadata(res.data.id, res.data.metadata.o2r);
                })
        self.setState({open:true, progress: 100})
        this.props.history.push({
          pathname: '/erc/' + id,
          state: { data: metadata }
      });

        });
  }

  handleChange = (event) => {
    this.setState({value : event.target.value});
  };

  handleClose() {
    this.setState({ open: false })
  }
  
  setUpperState = (state) => {
    console.log(state)
    this.setState(state)
  }


render() {
  const { spacing } = this.state;

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div style={{ marginTop: "5%", marginLeft: "auto", marginRight: "auto" }}>
            <h1>Create your own Executable Research Compendium (ERC)</h1>
            <div style={{ width: "65%", marginLeft: "auto", marginRight: "auto" }}>
              <div className="instruction">
                <b>Step 1: Create an R Markdown file including your R analysis</b>
              </div>
              <div className="instruction">
                <b>Step 2: Add metadata to your R Markdown in YAML format like <a target="_blank"  rel="noopener noreferrer" href="https://github.com/o2r-project/erc-examples/blob/master/ERC/Finished/INSYDE/workspace/main.Rmd">here (optional)</a>
                </b><br />
              </div>
              <div className="instruction">
                <b>Step 3: Run your R Markdown to generate the HTML file</b><br />
              </div>
              <div className="instruction">
                <b>Step 4: Upload your workspace including the code files, data, and the HTML (.zip)</b><br />
              </div>
              <div className="instruction">
                <b>No workspace at hand? Just upload one of our <a target="_blank"  rel="noopener noreferrer" href="https://github.com/o2r-project/erc-examples/tree/master/ERC/Finished">example workspaces</a></b>
              </div>
              <Dropzone loggedIn={this.props.loggedIn} setUpperState={this.setUpperState} handleClose={this.handleClose}/>
            </div>
          </div>

        </Grid>
        <Grid item xs={6}>
          <div style={{ marginTop: "5%", textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
            <h1>Upload via public share</h1>
            <div style={{ width: "65%", marginLeft: "auto", marginRight: "auto" }}>
              <div className="instruction">
                <b>Examine published ERC from the <a href="https://sandbox.zenodo.org/communities/o2r/">o2r community on Zenodo Sandbox</a></b>
              </div>
              <br />
              <form noValidate autoComplete="off">
                <TextField id="outlined-basic" value={this.state.value} label="Zenodo link or DOI" variant="outlined" onChange={this.handleChange}/>
              </form>
              <br />
              <br />
              <Button variant="contained" color="primary" onClick={this.submit}>Submit</Button>
            </div>

          </div>

        </Grid>
      </Grid>


      <InspectExamples />
      <Dialog open={this.state.open}>
          <DialogTitle> {this.state.title}</DialogTitle>
          {this.state.errorMessage ?
            <div>
              <DialogContent>
                {this.state.errorMessage}
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose.bind(this)} color="primary">
                  OK
              </Button>
              </DialogActions> </div> :
            <DialogContent style={{"align-self": "center", "overflow-y": "unset"}}>
              <CircularProgress variant="static" value={this.state.progress}/>
              <p> {this.state.progress} % </p>
            </DialogContent>
          }
        </Dialog>
    </div>
    
  );
}
}

export default withRouter(Startpage);