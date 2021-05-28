import React, { Component } from "react";
import { Button, Accordion, AccordionDetails, AccordionSummary, Typography, CircularProgress, Dialog, DialogContent, DialogTitle, DialogActions } from "@material-ui/core";
import socketIOClient from "socket.io-client";
import {v1 as uuid} from 'uuid';

import httpRequests from '../../../helpers/httpRequests';
import './check.css';
//import config from '../../../helpers/config';
import Logs from './Logs/Logs';
import Comparison from './Comparison/Comparison'
import {withRouter} from 'react-router-dom';


class jobsRender extends Component {

    constructor(props) {
        super(props);
        let displayfile = "null"
        this.state={
            id: this.props.match.params.id,
            jobId: this.props.match.params.jobId,
            job: this.props.location.state ? this.props.location.job : undefined,
            displayfile: this.props.location.state ? this.props.location.state.displayfile : displayfile,
            result: this.props.location.state ? this.props.location.state.result : "unset",
            runningJob: this.props.location.state ?this.props.location.state.runningJob : false
        }
    }

    componentDidMount(){
        let result = this.props.location.hash;
        if(result == "#result"){
            result=true;
        }
        else{
            result=false;
        }

        if(!this.state.job){
            this.getDisplayfile();
            this.getJob();
        }

        if(this.state.result === "unset"){
            this.setState({result});
        }

        if(this.state.runningJob){
            this.socket();
        }
    }

    socket() {
        const self = this;
        const socket = socketIOClient(config.baseUrl + "logs/job");
        socket.on("connect", function (evt) {
            console.log("Job socket connected");
        });
        socket.on("document", (evt) => {
            console.log("document event");
        });
        socket.on("set", (evt) => {
            console.log("Job socket set");
            self.getJob()
        });
    }


    getJob(){
        const self = this;
        httpRequests.getSingleJob(this.state.jobId)
        .then(function (res2) {
            httpRequests.getLogs(res2.data.id)
                .then(function (res3) {
                    let job = res2.data;
                    job.logs = res3.data.steps;
                    self.setState({job})
                })
                .catch(function (res3) {

                })
        })
        .catch(function (res2) {
            console.log(res2)
        })
}
    

getDisplayfile(){
    const self=this;
    httpRequests.singleCompendium(this.state.id)
            .then(function (response) {
                console.log(response)
                self.setState({"displayfile": response.data.metadata.o2r.displayfile})
            })
}

    render() {
        return(
            this.state.result? 
            <Comparison job={this.state.job} id={this.state.id} displayfile={this.state.displayfile}>
            </Comparison>:
            <Logs job={this.state.job} id={this.state.id}>
            </Logs>
        )
    }
}

export default withRouter(jobsRender);