import React, { Component } from "react";
import { Button, Input } from "@material-ui/core";
import Dropzone from './Dropzone/Dropzone';
import { withRouter } from 'react-router-dom';

import './upload.css';
import httpRequests from '../../helpers/httpRequests';
import Examples from './Examples/Examples';

class Upload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url:'',
            folder:'',
        };
    }

    upload = () => {
        this.props.history.push('/createERC');
        httpRequests.uploadViaSciebo(document.getElementById("scieboURL").value,
                            document.getElementById("scieboFolder").value)
            .then(
                response=>console.log(response)
            )
            .catch(
                response=> console.log(response)
            );
    }

    enterURL = (newURL, newFolder) => {
        this.setState({
            url: newURL,
            folder: newFolder,
        })
    }

    render() {
        
        return (
            <div>
                <h1>Create an ERC</h1>
                <div className="option1">
                    <div>
                        <h3>Option 1: Upload via public share</h3>
                    </div>
                    <div>
                        <Input
                            id="scieboURL"
                            fullWidth
                            placeholder="Enter link to public folder"
                            value={this.state.url}/>
                    </div>
                    <div>
                        <Input
                            id="scieboFolder"
                            fullWidth
                            placeholder="Enter folder name"
                            value={this.state.folder}/>
                    </div>
                    <div className="uploadButton">
                        <Button variant="contained" color="primary" disabled={!this.props.loggedIn}
                            onClick={this.upload}>
                            Load workspace
                        </Button>
                        
                        <Examples onClick={this.enterURL} />
                    </div>
                </div>
                <div>
                    <h3>Option 2: Upload your workspace (.zip)</h3>
                    <Dropzone />
                </div>
            </div>
        );
    }
}

export default withRouter(Upload);