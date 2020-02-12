import React, { Component } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, FormControl, RadioGroup, Slide, Radio, FormControlLabel, Grid } from "@material-ui/core";

import httpRequests from '../../../helpers/httpRequests';

class DownloadPop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            successfulJob: false
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
                for (let i = 0; i < res.data.results.length; i++) {
                    httpRequests.getSingleJob(res.data.results[i])
                        .then(function (res2) {
                            if (res2.data.status === "success") {
                                self.setState({ successfulJob: true })
                            }
                        })
                }
            });
    }

    handleChange = event => {
        this.setState({ value: event.target.value })
    }




    handleDownload = () => {

        const downloadUrl = httpRequests.downloadERC(this.props.id, this.state.value)

        window.open(downloadUrl)
        this.handleClose();
    }

    handleClose() {
        this.props.handleClose();
    }

    render() {


        return (
            <div>
                <Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{ "align-self": "center" }} id="form-dialog-title">ERC Download</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you want to download the image as well?
                        </DialogContentText>
                    </DialogContent>
                    <Grid container spacing={0}>
                    <Grid item xs={4}>
                    {this.state.successfulJob ? "" : <div style={{"margin-left": "10px"}}> <DialogContentText>
                        Image tarball is missing, so it is not available for download. Please run the analysis first.
                    </DialogContentText> </div>}
                    </Grid>
                    <Grid item xs={4} style={{ "text-align": "center"}}>
                    <FormControl style={{"top" : "20%"}} component="fieldset">
                        <RadioGroup aria-label="position" name="position" value={this.state.value} onChange={this.handleChange} row>
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="Yes"
                                labelPlacement="top"
                                disabled={!this.state.successfulJob}
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio color="primary" />}
                                label="No"
                                labelPlacement="top"
                            />
                        </RadioGroup>
                    </FormControl>
                    </Grid>
                    </Grid>             
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