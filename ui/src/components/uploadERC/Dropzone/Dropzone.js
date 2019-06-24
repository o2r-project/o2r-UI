import React, {Component} from 'react';
import {DropzoneArea} from 'material-ui-dropzone';
import {Button} from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import './Dropzone.css';
import httpRequests from '../../../helpers/httpRequests';
 
class DropzoneAreaExample extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      files: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.uploadFolder = this.uploadFolder.bind(this);
  }
  
  handleChange(files) {
    this.setState({
      files: files
    });
  }

  uploadFolder() {
    const properties = this.props;
    const data = new FormData();
    data.append('compendium', this.state.files[0]);
    data.append('content_type', 'workspace');
    httpRequests.uploadWorkspace(data)
    .then(function(response) {
      properties.history.push('/createERC/' + response.data.id);
    })
    .catch(function(response){
      console.log(response);
    })
  }
  
  render(){
    return (
      <div>
        <DropzoneArea 
          onChange={this.handleChange}
          />
        <Button className="uploadButton" variant="contained" color="primary"
          onClick={this.uploadFolder}>
          Load workspace
        </Button>
      </div>
    )  
  }
}

export default withRouter(DropzoneAreaExample);