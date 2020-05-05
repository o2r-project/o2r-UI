import React, { Component } from "react";
import { Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, CircularProgress, Dialog, DialogContent, DialogTitle, DialogActions } from "@material-ui/core";
import socketIOClient from "socket.io-client";
import uuid from 'uuid/v1';

import httpRequests from '../../../helpers/httpRequests';
import './check.css';
import config from '../../../helpers/config';
import Comparison from './Comparison/Comparison';
import Logs from './Logs/Logs';

function Status(status) {
    switch (status.status) {
        case 'success':
            return <span className="success">Success</span>
        case 'failure':
            if (status.checkStatus !== "failure") {
                return <span className="failure">Process Failed (check logs)</span>
            }
            else {
                return <span className="failure">Reproducibility Failed (click on "Show Result")</span>
            }
        case 'running':
            return <span className="running">Running <CircularProgress size={15} /></span>
        case 'skipped':
            return <span className="skipped">Skipped</span>
        case 'queued':
            return <span className="queued">Queued</span>
        default:
            return <span>No Status</span>
    };
}

class ListJobs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: props.runningJob ? props.jobs[0].id : 'panel1',
        }
    }

    handleChange = panel => (event, newExpanded) => {
        this.setState({
            expanded: newExpanded ? panel : false
        })
    };


    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.jobs[0] && this.props.jobs[0].id !== prevProps.jobs[0].id) {
            this.setState({ expanded: this.props.runningJob ? this.props.jobs[0].id : 'panel1' });
        }
    }

    render() {
        return (
            <div>
                {this.props.jobs.map(job => (
                    <ExpansionPanel square key={uuid()}
                        expanded={this.state.expanded === job.id}
                        onChange={this.handleChange(job.id)}>
                        <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
                            <Typography><b>Started: </b>{job.steps.validate_bag.start} <br />
                                <b>Overall Status: </b><Status checkStatus={job.steps.check.status} status={job.status}></Status>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography className="steps">
                                <span><b>Create configuration file: </b><Status status={job.steps.generate_configuration.status}></Status></span><br />
                                <span><b>Validate configuration file: </b><Status status={job.steps.validate_compendium.status}></Status></span><br />
                                <span><b>Create docker manifest: </b><Status status={job.steps.generate_manifest.status}></Status></span><br />
                                <span><b>Build docker image: </b><Status status={job.steps.image_build.status}></Status></span><br />
                                <span><b>Execute analysis: </b><Status status={job.steps.image_execute.status}></Status></span><br />
                                <span><b>Compare original and reproduced results: </b><Status checkStatus={job.steps.check.status} status={job.steps.check.status}></Status></span><br />
                                <Comparison job={job} className="compare"></Comparison>
                                <Logs job={job} logs={this.props.logs}></Logs>
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))}
            </div>
        );
    }
}

class Check extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            socketPath: config.baseUrl,
            runningJob: [],
        }
    }

    socket() {
        const self = this;
        const socket = socketIOClient(this.state.socketPath + "logs/job");
        socket.on("connect", function (evt) {
            console.log("Connected");
        });
        socket.on("document", (evt) => {
            console.log("document event");
        });
        socket.on("set", (evt) => {
            httpRequests.getSingleJob(evt.id)
                .then(function (res) {
                    let tmp = [];
                    tmp.push(res.data);
                    self.setState({
                        runningJob: tmp,
                    });
                })
                .catch(function (res) {
                    console.log(res);
                })
        });
    }


    handleClose() {
        this.setState({ open: false })
    }

    newJob() {
        if (this.state.runningJob[0]) {
            let help = this.state.jobs
            help.push(this.state.runningJob[0])
            this.setState({
                jobs: help.reverse()
            })
        }
        const self = this;
        httpRequests.newJob({ 'compendium_id': this.props.id })
            .then(function (res) {
                self.socket();
            })
            .catch((response) => {
                if (response.response.status === 401) {
                    self.setState({ open: true, title: "Request to Server Failed", errorMessage: "You have to be logged in to run an analysis" })
                }
            })
    }

    getJobs() {
        const self = this;
        httpRequests.listJobs(this.props.id)
            .then(function (res) {
                for (let i = 0; i < res.data.results.length; i++) {
                    httpRequests.getSingleJob(res.data.results[i])
                        .then(function (res2) {
                            httpRequests.getLogs(res2.data.id)
                                .then(function (res3) {
                                    let job = res2.data;
                                    job.logs = res3.data.steps;
                                    let jobsList = self.state.jobs;
                                    jobsList.push(job);
                                    if (Number(i) + 1 === Number(res.data.results.length)) {
                                        self.setState({
                                            jobs: jobsList.reverse(),
                                        });
                                    }

                                })
                                .catch(function (res3) {

                                })
                        })
                        .catch(function (res2) {
                            console.log(res2)
                        })
                }
            })
            .catch(function (res) {
                console.log(res)
            })
    }

    componentDidMount() {
        this.getJobs();
    }

    render() {
        return (
            <div>
                <div className="runAnalysisBtn">
                    <Button variant="contained" color="primary"
                        onClick={this.newJob.bind(this)}
                    >
                        Run analysis
                    </Button>
                </div>
                <Dialog open={this.state.open}>
                    <DialogTitle> {this.state.title}</DialogTitle>
                    <div>
                        <DialogContent>
                            {this.state.errorMessage}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose.bind(this)} color="primary">
                                OK
                            </Button>
                        </DialogActions> </div>
                </Dialog>
                <div>
                    {this.state.runningJob.length > 0 ?
                        <ListJobs
                            jobs={this.state.runningJob}
                            runningJob={true}
                        >
                        </ListJobs> : ''}
                    {this.state.jobs.length > 0 ?
                        <ListJobs
                            jobs={this.state.jobs}
                            runningJob={false}
                        >
                        </ListJobs> : ''}
                </div>
            </div>
        );
    }
}

export default Check;