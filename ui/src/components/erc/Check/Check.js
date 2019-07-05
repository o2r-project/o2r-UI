import React, { Component } from "react";
import { Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from "@material-ui/core";

import httpRequests from '../../../helpers/httpRequests';
import './check.css';

function Status(status) {
    switch(status.status) {
        case 'success':
            return <span className="success">Success</span>
        case 'failed':
            return <span className="failure">Failed</span>
        case 'running':
            return <span className="running">Running</span>
        case 'skipped':
            return <span className="skipped">Skipped</span>
        case 'queued':
            return <span className="queued">Queued</span>    
        default:
            return <span>No Status</span>
    };
}

function Job(props) {
    console.log(props)
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = panel => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
    <div>
        {props.jobs.map(job => (
            <ExpansionPanel square expanded={expanded === job.id} onChange={handleChange(job.id)}>
                <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography><b>Started: </b>{job.steps.validate_bag.start} <br/>
                                <b>Status: </b><Status status={job.status}></Status>
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography className="steps">  
                        <div><b>Validate compendium: </b><Status status={job.steps.validate_compendium.status}></Status></div>
                        <div><b>Validate bag: </b><Status status={job.steps.validate_bag.status}></Status></div>
                        <div><b>Image save: </b><Status status={job.steps.image_save.status}></Status></div>
                        <div><b>Image prepare: </b><Status status={job.steps.image_prepare.status}></Status></div>
                        <div><b>Image execute: </b><Status status={job.steps.image_execute.status}></Status></div>
                        <div><b>Image build: </b><Status status={job.steps.image_build.status}></Status></div>
                        <div><b>Generate manifest: </b><Status status={job.steps.generate_manifest.status}></Status></div>
                        <div><b>Generate configuration: </b><Status status={job.steps.generate_configuration.status}></Status></div>
                        <div><b>Cleanup: </b><Status status={job.steps.cleanup.status}></Status></div>
                        <div><b>Check: </b><Status status={job.steps.check.status}></Status></div>
                        {job.status !== "queued" ? <Button color="primary" variant="contained"
                                                        className="showResultBtn"
                                                        onClick={props.showResult}
                                                    >
                                                        Show result</Button> : ''}
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
        }
    }
    
    newJob() {
        const self = this;
        httpRequests.newJob({'compendium_id': this.props.id})
            .then(function(res) {
                httpRequests.getSingleJob(res.data.job_id)
                    .then(function(res2){
                        let job = res2.data;
                        let jobsList = self.state.jobs;
                            jobsList.unshift(job);
                        self.setState({
                            jobs: jobsList
                        })
                    })
                    .catch(function(){

                    })
            })
            .catch(function(res) {
                console.log(res)
            })
    }

    getJob() {
        const self = this;
        let jobsList = this.state.jobs;
        httpRequests.listJobs()
            .then(function(res) {
                for(let i=0; i<res.data.results.length; i++) {
                    httpRequests.getSingleJob(res.data.results[i])
                        .then(function(res2){
                            let job = res2.data;
                            let jobsList = self.state.jobs;
                                jobsList.push(job);
                            if (Number(i) +1 === Number(res.data.results.length)){
                                self.setState({
                                    jobs: jobsList.reverse()
                                });
                            }
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

    showResult() {
        console.log("show result")
    }

    componentDidMount() {
        this.getJob();
    }

    render() {
        return (
            <div>
                <div className="runAnalysisBtn">
                    <Button variant="contained"
                        
                        onClick={this.newJob.bind(this)}>
                        Run analysis
                    </Button>
                </div>
                <div>
                    {this.state.jobs.length>0 ? 
                        <Job 
                            jobs={this.state.jobs}
                            showResult={this.showResult}
                        >
                        </Job> : 'No Jobs'}
                </div>
            </div>
        );
    }
}

export default Check;












