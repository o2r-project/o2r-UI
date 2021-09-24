import React, { Component } from "react";
import { Button, Accordion, AccordionDetails, AccordionSummary, Typography, CircularProgress, Dialog, DialogContent, DialogTitle, DialogActions } from "@material-ui/core";
import socketIOClient from "socket.io-client";
import { v1 as uuid } from 'uuid';

import httpRequests from '../../../helpers/httpRequests';
import './check.css';
import { withRouter } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Comparison from './Comparison/Comparison'
import Logs from './Logs/Logs'


function Status(status) {
    const theme = useTheme();
    switch (status.status) {
        case 'success':
            return <span style={{ "color": theme.palette.success.main }}>Success</span>
        case 'failure':
            if (status.checkStatus !== "failure") {
                return <span style={{ "color": theme.palette.failure.main }}>Process Failed (check logs)</span>
            }
            else {
                return <span style={{ "color": theme.palette.failure.main }}>Reproduction Failed (click on "Show Result" for details)</span>
            }
        case 'running':
            return <span className="running" style={{ color: theme.palette.primary.main }} >Running <CircularProgress size={15} /></span>
        case 'skipped':
            return <span className="skipped" >Skipped</span>
        case 'queued':
            return <span className="queued" style={{ color: theme.palette.warning.main }} >Queued</span>
        default:
            return <span>No Status</span>
    };
}

class ListJobs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: props.runningJob ? props.jobs[0].id : 'panel1',
            comparisonOpen: false,
            logsOpen: false,
            jobOpen: null
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

    handleClickOpen(job, hash) {
        let result = false
        if (hash === "result") {
            result = true;
        }
        if (this.props.ojsView) {
            if (result) {
                this.setState({ "jobOpen": job, "comparisonOpen": true })
            }
            else {
                this.setState({ "jobOpen": job, "logsOpen": true })
            }
        }
        else {

            this.props.history.push({
                pathname: '/erc/' + this.props.id + '/job/' + job.id + "#" + hash,
                state: { job: job, runningJob: this.props.runningJob, displayfile: this.props.displayfile, result: result }
            });
        }
    }

    handleOJSClose() {
        const self= this;
        self.setState({ "comparisonOpen": false, "logsOpen": false })
    }

    render() {
        return (
            <div>
                {this.props.jobs.map((job,id )=> (
                    <Accordion square key={uuid()} 
                        expanded={this.state.expanded === job.id}
                        onChange={this.handleChange(job.id)}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
                            <Typography><b>Started: </b>{job.steps.validate_bag.start} <br />
                                <b>Overall Status: </b><Status checkStatus={job.steps.check.status} status={job.status}></Status>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="steps">
                                <div className="stepmargin"><span><b id="stepOne">1) Create configuration file: </b><Status status={job.steps.generate_configuration.status} /></span></div>
                                <div className="stepmargin"><span><b>2) Validate configuration file: </b><Status status={job.steps.validate_compendium.status} /></span></div>
                                <div className="stepmargin"><span><b>3) Create docker manifest: </b><Status status={job.steps.generate_manifest.status}></Status></span></div>
                                <div className="stepmargin"><span><b>4) Build docker image: </b><Status status={job.steps.image_build.status}></Status></span></div>
                                <div className="stepmargin"><span><b>5) Execute analysis: </b><Status status={job.steps.image_execute.status}></Status></span></div>
                                <div className="stepmargin"><span><b>6) Compare original and reproduced results: </b><Status checkStatus={job.steps.check.status} status={job.steps.check.status}></Status></span></div>
                                <Button variant="contained" color="primary"
                                    disabled={job.status !== 'failure' && job.status !== 'success'}
                                    onClick={()=> this.handleClickOpen(job, "result")}
                                    id="result"
                                    style={{ marginTop: "5%",marginRight:"10%", width: "150px", }}
                                >
                            Show result
                                </Button>
                                <Button variant="contained" color="primary"
                                    onClick={() => this.handleClickOpen(job, "logs")}
                                    id="logs"
                                    style={{ marginTop: "5%", width: "150px", }}
                                >
                            Show logs
                                </Button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}
                {this.state.comparisonOpen?
                <Comparison job={this.state.jobOpen} id={this.props.id} displayfile={this.props.displayfile} handleClose={()=> this.handleOJSClose()} ojsView={this.props.ojsView} open={this.state.comparisonOpen}>
                </Comparison> : "" }
                {this.state.logsOpen?
                <Logs job={this.state.jobOpen} id={this.props.id} handleClose={() => this.handleOJSClose()} ojsView={this.props.ojsView} open={this.state.logsOpen}>
                </Logs>  :""}
            </div>

        );
    }

}

class Check extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            socketPath: config.baseUrl, // eslint-disable-line
            runningJob: [],
        }
    }


    socket() {
        const self = this;
        const socket = socketIOClient(this.state.socketPath + "logs/job");
        socket.on("connect", function (evt) {
            console.log("Job socket connected");
        });
        socket.on("document", (evt) => {
            console.log("document event");
        });
        socket.on("set", (evt) => {
            console.log("Job socket set");
            httpRequests.getSingleJob(evt.id)
                .then(function (res) {
                    let tmp = [];
                    tmp.push(res.data);
                    self.setState({
                        runningJob: tmp,
                    });
                })
                .catch(function (res) {
                    console.log(res)
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
                if (response.status === 401) {
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
        document.title = "Check | ERC " + this.props.id + config.title; // eslint-disable-line
    }

    render() {
        return (
            <div>
                <div className="runAnalysisBtn">
                    <Button variant="contained" color="primary" id="runAnalysis"
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
                            displayfile={this.props.displayfile}
                            id={this.props.id}
                            history={this.props.history}
                            ojsView={this.props.ojsView}
                        >
                        </ListJobs> : ''}
                    {this.state.jobs.length > 0 ?
                        <ListJobs
                            jobs={this.state.jobs}
                            runningJob={false}
                            displayfile={this.props.displayfile}
                            id={this.props.id}
                            history={this.props.history}
                            ojsView={this.props.ojsView}
                        >
                        </ListJobs> : ''}
                </div>
            </div>
        );
    }
}

export default withRouter(Check);
