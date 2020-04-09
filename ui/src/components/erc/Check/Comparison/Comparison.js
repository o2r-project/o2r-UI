import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, Typography } from "@material-ui/core";
import logo from '../../../../assets/img/o2r-logo-only-white.svg';
import Iframe from 'react-iframe';

import config from '../../../../helpers/config';
import './comparison.css';
import * as $ from 'jquery';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ComparisonView(props) {
    const job = props.job;
    const [open, setOpen] = React.useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function dialogEntered() {
        if (job.status === 'success') {
            $("#frame1").contents().scroll(function () {
                $("#frame2").contents().scrollTop($("#frame1").contents().scrollTop());
            });
            $("#frame2").contents().scroll(function () {
                $("#frame1").contents().scrollTop($("#frame2").contents().scrollTop());
            });
        }
        else {
            $("#frame1").contents().scroll(function () {
                $("#frame2").contents().scrollTop($("#frame1").contents().scrollTop());
                $("#frame3").contents().scrollTop($("#frame1").contents().scrollTop());
            });
            $("#frame2").contents().scroll(function () {
                $("#frame1").contents().scrollTop($("#frame2").contents().scrollTop());
                $("#frame3").contents().scrollTop($("#frame2").contents().scrollTop());
            });
            $("#frame3").contents().scroll(function () {
                $("#frame1").contents().scrollTop($("#frame3").contents().scrollTop());
                $("#frame2").contents().scrollTop($("#frame3").contents().scrollTop());
            });
        }
    }



    return (
        <div>
            <Button variant="contained" color="primary"
                disabled={job.status !== 'failure' && job.status !== 'success'}
                onClick={handleClickOpen}
                style={{ marginTop: "5%", width: "150px", }}
            >
                Show result
            </Button>
            <Dialog className="main_block" fullScreen TransitionComponent={Transition}
                open={open}
                onClose={handleClose}
                onEntered={dialogEntered}
            >
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                            <a href="/"><img src={logo} alt="o2r" id="headerLogo" /></a>
                        </Typography>
                        <Button color="inherit" onClick={handleClose}>Close</Button>
                    </Toolbar>
                </AppBar>
                {job.status === 'success' ?
                    <div className="compare_">
                        <h4 className="title" style={{ marginLeft: "1%" }}> Original results </h4>
                        <h4 className="title"> Reproduced results </h4>
                        <Iframe className="display" id={'frame1'} url={config.baseUrl + "job/" + job.id + "/data/display.html"}></Iframe>
                        <Iframe className="check" id={'frame2'} url={config.baseUrl + "job/" + job.id + "/data/check.html"}></Iframe>
                    </div> :
                    <div className="compare_">
                        <h4 className="title_" > Original results </h4>
                        <h4 className="title_"> Reproduced results </h4>
                        <h4 className="title_"> Differences between original and reproduced results </h4>
                        <Iframe className="display_" id={'frame1'} url={config.baseUrl + "compendium/" + job.compendium_id + "/data/display.html"}></Iframe>
                        <Iframe className="check_" id={'frame2'} url={config.baseUrl + "job/" + job.id + "/data/display.html"}></Iframe>
                        <Iframe className="diff" id={'frame3'} url={config.baseUrl + "job/" + job.id + "/data/check.html"}></Iframe>
                    </div>
                }
            </Dialog>
        </div>
    );
}

class Comparison extends Component {

    render() {
        return (
            <ComparisonView job={this.props.job}></ComparisonView>
        );
    }
}

export default Comparison;