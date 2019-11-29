import React, { Component } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, FormControl, RadioGroup, Slide, Radio, FormControlLabel, Grid } from "@material-ui/core";

import httpRequests from '../../../helpers/httpRequests';

class SubstitutionInfoPop extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose() {
        this.props.handleClose();
    }

    render() {


        return (
            <div>
                <Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{ "align-self": "center" }} id="form-dialog-title">Substitution Info</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please specify if you want to download the image of the ERC as well
                        </DialogContentText>
                    </DialogContent>          
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}


export default SubstitutionInfoPop;