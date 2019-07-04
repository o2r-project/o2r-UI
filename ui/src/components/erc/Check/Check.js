import React, { Component } from "react";
import { Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from "@material-ui/core";
import httpRequests from '../../../helpers/httpRequests';

  class Check extends Component {

    constructor(props) {
        super(props);
        this.state={
            isExpanded: false,
        }
    }

    handleChange(evt) {
        this.setState({
            isExpanded:!this.state.setExpanded,
        })
    }

    getJob() {
        const self = this;
        httpRequests.listJobs()
            .then(function(res) {
                console.log(res)
                for(let i=0; i<res.data.results.length; i++) {
                    httpRequests.getSingleJob(res.data.results[i])
                        .then(function(res2){
                            console.log(res2)
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
        this.getJob();
    }

    render() {

        return (
            <div>
                <Button 
                    onClick={this.props.newJob}>
                    Run analysis
                </Button>
                <ExpansionPanel>           
                    <ExpansionPanelSummary  
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography >General settings</Typography>
                        <Typography >I am an expansion panel</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                            maximus est, id dignissim quam.
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

export default Check;












