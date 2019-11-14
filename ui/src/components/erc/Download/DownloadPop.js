import React, { Component } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, FormControl, RadioGroup, Slide, Radio, FormControlLabel } from "@material-ui/core";

import httpRequests from '../../../helpers/httpRequests';


class DownloadPop extends Component {

    constructor(props) {
        super(props);
        this.state={
            value: 0,
            jobsCount: 0
        }

        this.handleClose = this.handleClose.bind(this)
    }

    componentDidMount() {
        this.getJobs();
    }

    getJobs() {
        const self = this;
        httpRequests.listJobs(this.props.id)
            .then(function (res) {
                self.setState({jobsCount: res.data.results.length})
                });
            }

    handleChange = event =>{
        this.setState({value : event.target.value})
    }

    onStartedDownload(id) {
        console.log(`Started downloading: ${id}`);
      }
      
    onFailed(error) {
        console.log(`Download failed: ${error}`);
      }
      

    handleDownload = () =>{

        const downloadUrl = httpRequests.downloadERC(this.props.id, this.state.value)

        window.open(downloadUrl)
        this.handleClose();
    }

    handleClose()  {
        console.log(2)
        this.props.handleClose();
    }

    render() {


        return (
            <div>
                <Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{"align-self" : "center" }} id="form-dialog-title">Download</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please specify if you want to download the image of the ERC as well
                        </DialogContentText>
                    </DialogContent>
                    <FormControl style={{"align-self" : "center" }} component="fieldset">
                        <RadioGroup aria-label="position" name="position" value={this.state.value} onChange={this.handleChange} row>
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="Yes"
                                labelPlacement="top"
                                disabled= {this.state.jobsCount === 0}
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio color="primary" />}
                                label="No"
                                labelPlacement="top"
                            />
                        </RadioGroup>
                    </FormControl>
                    {this.state.jobsCount === 0 ? <DialogContentText>
                        To download an image, you must first generate it. Please perform an analysis.
                    </DialogContentText> : ""
                    }
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button disabled={this.state.value === 0} onClick={this.handleDownload.bind(this)} color="primary">
                            Download
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}


export default DownloadPop;