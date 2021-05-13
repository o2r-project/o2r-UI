import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, DialogContent, Typography } from "@material-ui/core";
import {v1 as uuid} from 'uuid';
import logo from '../../../../assets/img/o2r-logo-only-white.svg';
import { withRouter } from 'react-router-dom';

import httpRequests from '../../../../helpers/httpRequests';
import './logs.css';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class LogsView extends Component{


    constructor(props) {
        super(props);
        this.state = { open: true, job: props.job }
    };

    componentDidMount() {
        const self = this;
        if (this.props.job) {
            self.setState({ open: true })
        }
    }

  
    handleClose = () => {
        this.props.history.push({
            pathname: '/erc/' + this.props.id + "#Check",
            state: { id : this.props.id, hash: "#Check"}
        });
    }
  
    render() {
        return (
        <div>
            {this.props.job !== undefined ?
            <Dialog className="main_block" fullScreen TransitionComponent={Transition}
                open={this.state.open} 
                onClose={this.handleClose}
            >
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                            <a href="/"><img src={logo} alt="o2r" id="headerLogo" /></a>
                        </Typography>
                        <Button id ="close" color="inherit" onClick={this.handleClose}>Close</Button>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{marginTop: "64px", paddingTop: "20px"}}>
                {this.props.job.logs ? 
                <div className="logs">
                    <b id="bag"> Validate bag: </b>
                    <ul>
                        {this.props.job.logs.validate_bag.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Generate configuration: </b>
                    <ul>
                        {this.props.job.logs.generate_configuration.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image prepare: </b>
                    <ul>
                        {this.props.job.logs.image_prepare.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Validate compendium: </b>
                    <ul>
                        {this.props.job.logs.validate_compendium.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Generate manifest: </b>
                    <ul>
                        {this.props.job.logs.generate_manifest.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image build: </b>
                    <ul>
                        {this.props.job.logs.image_build.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image execute: </b>
                    <ul>
                        {this.props.job.logs.image_execute.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image save: </b>
                    <ul>
                        {this.props.job.logs.image_save.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Check: </b>
                    <ul>
                        {this.props.job.logs.check.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Cleanup: </b>
                    <ul>
                        {this.props.job.logs.cleanup.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                </div> : "Job starting ... "}
                </DialogContent>
            </Dialog> : '' }
        </div>
    );
  }
}

class Logs extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <LogsView logs={this.props.logs} job={this.props.job} location={this.props.location} history={this.props.history} id={this.props.id}></LogsView>
            </div>
        );
    }
}

export default withRouter(Logs);