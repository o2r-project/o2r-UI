import React, { Component } from "react";
import { Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, CircularProgress } from "@material-ui/core";
import socketIOClient from "socket.io-client";
import uuid from 'uuid/v1';

import httpRequests from '../../../helpers/httpRequests';
import './check.css';
import config from '../../../helpers/config';
import Comparison from './Comparison/Comparison';
import Logs from './Logs/Logs';

function Status(status) {
    switch(status.status) {
        case 'success':
            return <span className="success">Success</span>
        case 'failure':
            return <span className="failure">Failed</span>
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

function ListJobs(jobs) {

    const [expanded, setExpanded] = React.useState(jobs.runningJob[0]? jobs.runningJob[0].id : 'panel1');
    const handleChange = panel => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };


    return (
        <div>
            {jobs.jobs.map(job => (
                <ExpansionPanel square key={uuid()}
                    expanded={expanded === job.id} 
                    onChange={handleChange(job.id)}>
                    <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" style={{backgroundColor:'rgb(245, 245, 245)'}}>
                        <Typography><b>Started: </b>{job.steps.validate_bag.start} <br/>
                                    <b>Overall Status: </b><Status status={job.status}></Status>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography className="steps">
                            <span><b>Validate bag: </b><Status status={job.steps.validate_bag.status}></Status></span><br/>
                            <span><b>Generate configuration: </b><Status status={job.steps.generate_configuration.status}></Status></span><br/>
                            <span><b>Validate compendium: </b><Status status={job.steps.validate_compendium.status}></Status></span><br/>
                            <span><b>Generate manifest: </b><Status status={job.steps.generate_manifest.status}></Status></span><br/>
                            <span><b>Image prepare: </b><Status status={job.steps.image_prepare.status}></Status></span><br/>
                            <span><b>Image build: </b><Status status={job.steps.image_build.status}></Status></span><br/>
                            <span><b>Image execute: </b><Status status={job.steps.image_execute.status}></Status></span><br/>
                            <span><b>Image save: </b><Status status={job.steps.image_save.status}></Status></span><br/>
                            <span><b>Check: </b><Status status={job.steps.check.status}></Status></span><br/>
                            <span><b>Cleanup: </b><Status status={job.steps.cleanup.status}></Status></span><br/>
                            <Comparison job={job} className="compare"></Comparison>
                            <Logs job={job} ></Logs>
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            ))}
        </div>
    );
  }

class Check extends Component {

    constructor(props) {
        super(props);
        this.state={
            jobs: [],
            socketPath: config.baseUrl,
            runningJob: [],
        }
    }

    socket() {
        const self = this;
        const socket = socketIOClient(this.state.socketPath + "logs/job");
        socket.on("connect", function(evt) {
            console.log("Connected");
        });
        socket.on("document", (evt) => {
            console.log("document event");
        });
        socket.on("set", (evt) => {
            httpRequests.getSingleJob(evt.id)
                .then(function(res) {
                    let tmp = [];
                        tmp.push(res.data);
                    self.setState({
                        runningJob:tmp,
                    });
                })
                .catch(function(res) {
                    console.log(res);
                })
        });
    }
    
    newJob() {
        if(this.state.runningJob[0]){
            let help=  this.state.jobs
            help.push(this.state.runningJob[0])
            this.setState({
                jobs: help.reverse()
            })
        }
        const self = this;
        httpRequests.newJob({'compendium_id': this.props.id})
            .then(function(res) {
                self.socket();
            })
            .catch(function(res) {
                console.log(res)
            })
    }

    getJobs() {
        const self = this;
        httpRequests.listJobs(this.props.id)
            .then(function(res) {
                for(let i=0; i<res.data.results.length; i++) {
                    httpRequests.getSingleJob(res.data.results[i])
                        .then(function(res2){
                            httpRequests.getLogs(res2.data.id)
                                .then(function(res3) {
                                    let job = res2.data;
                                        job.logs = res3.data.steps;
                                    let jobsList = self.state.jobs;
                                        jobsList.push(job);
                                    if (Number(i) +1 === Number(res.data.results.length)){
                                        self.setState({
                                            jobs: jobsList.reverse(),
                                        });
                                    }    

                                })
                                .catch(function(res3) {

                                })
                        })
                        .catch(function(res2){
                            console.log(res2)
                        })
                }
            })
            .catch(function(res) {
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
                <div>
                    {this.state.runningJob.length>0 ? 
                        <ListJobs 
                            jobs={this.state.runningJob}
                            runningJob={this.state.runningJob}
                        >
                        </ListJobs> : ''}
                    {this.state.jobs.length>0 ? 
                        <ListJobs 
                            jobs={this.state.jobs}
                            runningJob={this.state.runningJob}
                        >
                        </ListJobs> : ''}
                </div>
            </div>
        );
    }
}

export default Check;