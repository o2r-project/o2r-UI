import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide } from "@material-ui/core";
import Iframe from 'react-iframe';

import config from '../../../../helpers/config';
import './comparison.css';

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
  
    return (
        <div>
            <Button variant="contained" color="primary" 
                disabled={job.status !== 'failure' && job.status !== 'success'}
                onClick={handleClickOpen}
                style={{marginTop: "5%", width: "150px",}}
            >
                Show result
            </Button>
            <Dialog className="main_block" fullScreen TransitionComponent={Transition}
                open={open} 
                onClose={handleClose}
            >
                <AppBar>
                    <Toolbar>
                        <Button color="inherit" onClick={handleClose}>Close</Button>
                    </Toolbar>
                </AppBar>
                {job.status === 'success' ?
                    <div className="compare">
                        <Iframe className="display" url={config.baseUrl + "job/" + job.id + "/data/display.html"}></Iframe>
                        <Iframe className="check"   url={config.baseUrl + "job/" + job.id + "/data/check.html"}></Iframe>
                    </div> : 
                    <div className="compare"> 
                        <Iframe className="display_" url={config.baseUrl + "compendium/" + job.compendium_id + "/data/display.html"}></Iframe>
                        <Iframe className="check_"   url={config.baseUrl + "job/" + job.id + "/data/display.html"}></Iframe>
                        <Iframe className="diff"     url={config.baseUrl + "job/" + job.id + "/data/check.html"}></Iframe>
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