import React, { Component } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import './Dropzone.css';
import httpRequests from '../../../helpers/httpRequests';

class Dropzone extends Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      
    };
  }

  config = {
    onUploadProgress: (progressEvent) =>{
      var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total * 0.8 );
      this.props.setUpperState({progress : percentCompleted})
    }
  }
  handleChange(files) {
    this.setState({
      files: files
    });
  }

  uploadFolder() {
    const self = this.props;
    const data = new FormData();
    data.append('compendium', this.state.files[0]);
    data.append('content_type', 'workspace');
    self.setUpperState({ title: "uploading ERC", open: true, errorMessage: null })
    httpRequests.uploadWorkspace(data, this.config)
      .then(function (response) {
        self.history.push({
          pathname: '/createERC/' + response.data.id});
      })
      .catch((response) => {
        if(!response.response){
          self.setUpperState({ title: "ERC Upload failed", errorMessage: "Something went wrong. Please try it again in a new window or different Browser." })
        }
        else if (response.response.status === 401) {
          self.setUpperState({ title: "ERC Upload failed", errorMessage: "You have to be logged in to upload a Workspace" })
        } 
        else if (response.response.status === 500) {
          self.setUpperState({ title: "ERC Upload failed", errorMessage: "You must select an ERC to upload" })
        }
      })
  }



  render() {
    return (
      <div>
        <DropzoneArea
          onChange={this.handleChange.bind(this)}
          maxFileSize={962144000}
          filesLimit={1}
          dropzoneText={"Drag and drop a workspace archive here or click"}
        />
        <br/>
        <Button
          id="upload" className="uploadButton" variant="contained" color="primary" style={{marginTop:"3%"}} disabled={!this.props.loggedIn}
          onClick={this.uploadFolder.bind(this)}>
          Load workspace
        </Button>
        {!this.props.loggedIn ? <p style={{color : "red"}}>You have to be logged in to upload a Workspace</p> : ""}

      </div>
    )
  }
}

export default withRouter(Dropzone);