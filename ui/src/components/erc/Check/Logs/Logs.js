import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, DialogContent, Typography } from "@material-ui/core";
import uuid from 'uuid/v1';
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
        this.state = { open: this.props.location.search === '?logs' ?  true:  false, 
                        job: props.job }
    };


    handleClickOpen = () => {
        this.props.history.push(this.props.location.pathname + '?logs')
    }
  
    handleClose = () => {
        window.history.back();
    }
  
    render() {
        return (
        <div>
            <Button variant="contained" color="primary" 
                onClick={this.handleClickOpen}
                style={{marginTop: "5%", width: "150px",}}
            >
                Show logs
            </Button>
            {this.props.logs !== null ?
            <Dialog className="main_block" fullScreen TransitionComponent={Transition}
                open={this.state.open} 
                onClose={this.handleClose}
            >
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                            <a href="/"><img src={logo} alt="o2r" id="headerLogo" /></a>
                        </Typography>
                        <Button color="inherit" onClick={this.handleClose}>Close</Button>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{marginTop: "64px", paddingTop: "20px"}}>
                <div className="logs">
                    <b>Validate bag: </b>
                    <ul>
                        {this.props.logs.validate_bag.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Generate configuration: </b>
                    <ul>
                        {this.props.logs.generate_configuration.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image prepare: </b>
                    <ul>
                        {this.props.logs.image_prepare.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Validate compendium: </b>
                    <ul>
                        {this.props.logs.validate_compendium.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Generate manifest: </b>
                    <ul>
                        {this.props.logs.generate_manifest.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image build: </b>
                    <ul>
                        {this.props.logs.image_build.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image execute: </b>
                    <ul>
                        {this.props.logs.image_execute.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Image save: </b>
                    <ul>
                        {this.props.logs.image_save.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Check: </b>
                    <ul>
                        {this.props.logs.check.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                    <b>Cleanup: </b>
                    <ul>
                        {this.props.logs.cleanup.text.map(log => (
                            <li key={uuid()}>
                                {log}
                            </li>
                        ))}
                    </ul>
                </div>
                </DialogContent>
            </Dialog> : '' }
        </div>
    );
  }
}

var i=0
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
                console.log(res)
                console.log(i)
                i++;
                self.setState({
                    logs: res.data.steps
                });
            })
            .catch(function(res) {
                console.log(res)
            })
    }

    componentDidMount() {
        if(!this.props.runningjob){
            this.getLogs(this.props.job.id)
        }
        else{
            this.setState({logs : this.props.logs})
        }
    }

/*    componentDidUpdate(prevProps) {
        console.log(this.props.logs)
        console.log(prevProps.logs)
        if (this.props.logs !== null && JSON.stringify(this.props.logs) !== JSON.stringify(prevProps.logs) && this.props.runningjob) {
            console.log(1)
            this.setState({ logs : this.props.logs });
        }
    }*/

    render() {
        return (
            <div>
                <LogsView logs={this.state.logs} job={this.props.job} location={this.props.location} history={this.props.history}></LogsView>
            </div>
        );
    }
}

export default withRouter(Logs);