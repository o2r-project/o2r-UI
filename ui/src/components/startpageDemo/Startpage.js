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
}

  submit = () => {
    let self= this;
    this.setState({open:true, progress: 30, title: "Retreving file from Zenodo"})
    httpRequests.uploadViaZenodo(this.state.value)
      .then((response) => {
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
    })
      .catch((response) => {
          if (response.response.status === 401) {
            self.setState({ title: "ERC Upload failed", errorMessage: "You have to be logged in to upload a Workspace" })
          } 
          else {
            self.setState({ title: "ERC Upload failed", errorMessage: "Wokrspace not found" })
          }
        })
  }

  submitLink = () => {
    let self= this;
    this.setState({open:true, progress: 30, title: "Retreving file from public link"})
    httpRequests.uploadViaLink(this.state.link, this.state.fileName)
      .then((response) => {
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
          pathname: '/createErc/' + id,
          state: { data: metadata }
        })
      })
      .catch((response) => {
        if (response.response.status === 401) {
          self.setState({ title: "ERC Upload failed", errorMessage: "You have to be logged in to upload a Workspace" })
        } 
        else {
          self.setState({ title: "ERC Upload failed", errorMessage: "Wokrspace not found" })
        }

        });
  }

  handleChange = (event) => {
    this.setState({value : event.target.value});
  };

  handleLinkChange = (event) => {
    this.setState({link : event.target.value});
  };

  handleFileNameChange = (event) => {
    this.setState({fileName : event.target.value});
  };

  handleClose() {
    this.setState({ open: false })
  }
  
  setUpperState = (state) => {
    this.setState(state)
  }



  componentDidMount(){
    document.title = "Home" + config.title; // eslint-disable-line
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
                <h3>To get instruction how to create an workspace, please click <a href= "https://o2r.info/pilots/#%EF%B8%8F-information-for-authors" target= "_blank">here </a>.</h3>
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
              <Button variant="contained" color="primary" onClick={this.submit}>Submit</Button>
            </div>

            <div style={{ width: "65%", marginLeft: "auto", marginRight: "auto", marginTop: "30px" }}>
              <div className="instruction">
                <b>Upload over a public sciebo url</b>
              </div>
              <br />
              <form noValidate autoComplete="off">
                <TextField id="outlined-basic" style ={{textAlign: "left"}} value={this.state.link} label="Link to the folder containing the zip file" variant="outlined" onChange={this.handleLinkChange}/>
                <span style ={{marginLeft: "20px"}}> </span>
                <TextField id="outlined-basic" style ={{textAlign: "left"}}  value={this.state.fileName} label="Name of the zip file" variant="outlined" onChange={this.handleFileNameChange}/>
              </form>
              <br />
              <Button variant="contained" color="primary" onClick={this.submitLink}>Submit</Button>
            </div>

          </div>

        </Grid>
      </Grid>


      <InspectExamples />
      <Dialog open={this.state.open} id="dialog">
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