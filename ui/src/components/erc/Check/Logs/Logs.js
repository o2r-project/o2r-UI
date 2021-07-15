import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, DialogContent, Typography } from "@material-ui/core";
import logo from '../../../../assets/img/o2r-logo-only-white.svg';
import { withRouter } from 'react-router-dom';
import Highlight from 'react-highlight.js';
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
            pathname: '/erc/' + this.props.id,
            hash: "#Check",
            state: { id : this.props.id}
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
                    <Highlight language="R" className="code">
                        {this.props.job.logs.validate_bag.text.join('\n')}
                    </Highlight>
                    <b>Generate configuration: </b>
                    <Highlight language="R" className="code">
                        {this.props.job.logs.generate_configuration.text.join('\n')}
                    </Highlight>
                    <b>Image prepare: </b>
                    <Highlight language="R" className="code">
                        {this.props.job.logs.image_prepare.text.join('\n')}
                    </Highlight>
                    <b>Validate compendium: </b>
                    <Highlight language="R" className="code">
                        {this.props.job.logs.validate_compendium.text.join('\n')}
                    </Highlight>
                    <b>Generate manifest: </b>
                    <Highlight language="R" className="code">
                        {this.props.job.logs.generate_manifest.text.join('\n')}
                    </Highlight>
                    <b>Image build: </b>
                    <Highlight language="R" className="code">
                        {this.props.job.logs.image_build.text.join('\n')}
                    </Highlight>
                    <b>Image execute: </b>
                    <Highlight language="R" className="code">
                        {this.props.job.logs.image_execute.text.join('\n')}
                    </Highlight>
                    <b>Image save: </b>
                    <Highlight language="R" className="code">
                        {this.props.job.logs.image_prepare.text.join('\n')}
                    </Highlight>
                    <b>Check: </b>
                    <Highlight language="R" className="code">
                        {this.props.job.logs.check.text.join('\n')}
                    </Highlight>
                    <b>Cleanup: </b>
                    <Highlight language="R" className="code">
                        {this.props.job.logs.cleanup.text.join('\n')}
                    </Highlight>
                </div> : "Job starting ... "}
                </DialogContent>
            </Dialog> : '' }
        </div>
    );
  }
}

class Logs extends Component {

    render() {
        return (
            <div>
                <LogsView logs={this.props.logs} job={this.props.job} location={this.props.location} history={this.props.history} id={this.props.id}></LogsView>
            </div>
        );
    }
}

export default withRouter(Logs);