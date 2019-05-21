import React, {Component} from 'react';
import {DropzoneArea} from 'material-ui-dropzone';
import {Button} from '@material-ui/core';

import './Dropzone.css';
import httpRequests from '../../../helpers/httpRequests';
 
class DropzoneAreaExample extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.uploadWorkspace = this.uploadWorkspace.bind(this);
  }
  
  handleChange(files) {
    this.setState({
      files: files
    });
  }

  uploadWorkspace() {
    httpRequests.uploadWorkspace(this.state.files)
    .then(
      response=>console.log(response)
    )
    .catch(
      response=>console.log(response)
    )
  }
  
  render(){
    return (
      <div>
        <DropzoneArea 
          onChange={this.handleChange}
          />
        <Button className="uploadButton" variant="contained" color="primary"
          onClick={this.uploadWorkspace}>
          Load workspace
        </Button>
      </div>
    )  
  }
}

export default DropzoneAreaExample;