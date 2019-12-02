import React, { Component } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import './Dropzone.css';
import httpRequests from '../../../helpers/httpRequests';

class Dropzone extends Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      progress: 0,
    };
  }

  config = {
    onUploadProgress: (progressEvent) =>{
      var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total * 0.8 );
      this.setState({progress : percentCompleted})
    }
  }
  handleChange(files) {
    this.setState({
      files: files
    });
  }

  uploadFolder() {
    const self = this.props;
    const state = this
    const data = new FormData();
    data.append('compendium', this.state.files[0]);
    data.append('content_type', 'workspace');
    state.setState({ title: "uploading ERC", open: true, errorMessage: null })
    httpRequests.uploadWorkspace(data, this.config)
      .then(function (response) {
        self.history.push({
          pathname: '/createERC/' + response.data.id,
          state: { data: response }
        });
      })
      .catch((response) => {
        if (response.response.status === 401) {
          state.setState({ title: "ERC Upload failed", errorMessage: "You have to be logged in to upload a Workspace" })
        } else if (response.response.status === 500) {
          state.setState({ title: "ERC Upload failed", errorMessage: "You must select an ERC to upload" })
        }
      })
  }

  handleClose() {
    this.setState({ open: false })
  }

  render() {
    return (
      <div>
        <DropzoneArea
          onChange={this.handleChange.bind(this)}
          maxFileSize={962144000}
        />
        <Button
          className="uploadButton" variant="contained" color="primary"
          onClick={this.uploadFolder.bind(this)}>
          Load workspace
        </Button>
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
        </Dialog>:

      </div>
    )
  }
}

export default withRouter(Dropzone);