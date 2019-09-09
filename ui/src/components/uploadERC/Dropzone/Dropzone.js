import React, { Component } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import './Dropzone.css';
import httpRequests from '../../../helpers/httpRequests';
 
class Dropzone extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      files: []
    };
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
    httpRequests.uploadWorkspace(data)
      .then(function(response) {
        self.history.push({
          pathname: '/createERC/' + response.data.id, 
          state: {data:response}
        });
      })
      .catch(function(response){
        console.log(response);
      })
  }
  
  render(){
    return (
      <div>
        <DropzoneArea 
          onChange={this.handleChange.bind(this)} 
          maxFileSize={262144000}
        />
        <Button 
          className="uploadButton" variant="contained" color="primary"
          onClick={this.uploadFolder.bind(this)}>
            Load workspace
        </Button>
      </div>
    )  
  }
}

export default withRouter(Dropzone);