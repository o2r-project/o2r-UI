import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide } from "@material-ui/core";
import uuid from 'uuid/v1';

import httpRequests from '../../../../helpers/httpRequests';
import './logs.css';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function LogsView(props) {
    const logs = props.logs;
    const job = props.job
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
                Show logs
            </Button>
            {logs !== null ?
            <Dialog className="main_block" fullScreen TransitionComponent={Transition}
                open={open} 
                onClose={handleClose}
            >
                <AppBar>
                    <Toolbar>
                        <Button color="inherit" onClick={handleClose}>Close</Button>
                    </Toolbar>
                </AppBar>
                <div className="logs">
                    <b>Validate bag: </b>
                    <ul>
                        {logs.validate_bag.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Generate configuration: </b>
                    <ul>
                        {logs.generate_configuration.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image prepare: </b>
                    <ul>
                        {logs.image_prepare.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Validate compendium: </b>
                    <ul>
                        {logs.validate_compendium.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Generate manifest: </b>
                    <ul>
                        {logs.generate_manifest.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image build: </b>
                    <ul>
                        {logs.image_build.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image execute: </b>
                    <ul>
                        {logs.image_execute.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image save: </b>
                    <ul>
                        {logs.image_save.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Check: </b>
                    <ul>
                        {logs.check.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Cleanup: </b>
                    <ul>
                        {logs.cleanup.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                </div>
            </Dialog> : '' }
        </div>
    );
  }

class Logs extends Component {

    constructor(props) {
        super(props);
        this.state={
            logs: null,
        }
    }

    getLogs(job_id) {
        const self = this;
        httpRequests.getLogs(job_id)
            .then(function(res) {
                self.setState({
                    logs: res.data.steps
                });
            })
            .catch(function(res) {
                console.log(res)
            })
    }

    componentDidMount() {
        this.getLogs(this.props.job.id)
    }

    render() {
        return (
            <div>
                <LogsView logs={this.state.logs} job={this.props.job}></LogsView>
            </div>
        );
    }
}

export default Logs;