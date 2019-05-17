import React, { Component } from "react";
import { Card, CardContent, Button, Input } from "@material-ui/core";
import Dropzone from './Dropzone/Dropzone'

import './upload.css';
import httpRequests from '../../helpers/httpRequests';

class Upload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url:''
        };
        this.scieboUpload = this.scieboUpload.bind(this);
    }

    scieboUpload() {
        httpRequests.
            uploadViaSciebo(document.getElementById("scieboURL").value,
                            document.getElementById("scieboFolder").value)
            .then(
                response=>console.log(response)
            )
            .catch(response => {
                console.log(response);
            });
    }

    render() {
        return (
            <Card id="uploadCard">
                <CardContent>
                    <h3>
                        Upload from public share
                    </h3>
                    <div>
                        <Input
                            id="scieboURL"
                            placeholder="Enter link to public folder"
                            inputProps={{
                                'aria-label': 'Description',
                            }}/>
                        <Input
                            id="scieboFolder"
                            placeholder="Enter folder name"
                            inputProps={{
                                'aria-label': 'Description',
                            }}/>
                    </div>
                    <div>
                        <Button 
                            onClick={this.scieboUpload}>
                            Load
                        </Button>
                        <Dropzone></Dropzone>
                    </div>
                </CardContent>
            </Card>
        );
    }
}

export default Upload;

