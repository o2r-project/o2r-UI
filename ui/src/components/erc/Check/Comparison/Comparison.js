import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, Typography, FormControlLabel, Checkbox} from "@material-ui/core";
import logo from '../../../../assets/img/o2r-logo-only-white.svg';
import Iframe from 'react-iframe';
import { withRouter } from 'react-router-dom';
import config from '../../../../helpers/config';
import './comparison.css';
import * as $ from 'jquery';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Comparison extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            job: this.props.job
        }
    };

    componentDidMount() {
        const self = this;
        document.title = "Comparison | ERC " + this.props.id + config.title;
    }

    handleClose = () => {
        this.props.history.push({
            pathname: '/erc/' + this.props.id,
            hash: "#Check",
            state: { id : this.props.id}
        });
    }

    activateScroll = () => {

          if (this.props.job.status === 'success') {
              $("#frame1").contents().scroll(function () {
                  $("#frame2").contents().scrollTop($("#frame1").contents().scrollTop());
              });
              $("#frame2").contents().scroll(function () {
                  $("#frame1").contents().scrollTop($("#frame2").contents().scrollTop());
              });
          }
          else {
              $("#frame1").contents().scroll(function () {
                  $("#frame2").contents().scrollTop($("#frame1").contents().scrollTop());
                  $("#frame3").contents().scrollTop($("#frame1").contents().scrollTop());
              });
              $("#frame2").contents().scroll(function () {
                  $("#frame1").contents().scrollTop($("#frame2").contents().scrollTop());
                  $("#frame3").contents().scrollTop($("#frame2").contents().scrollTop());
              });
              $("#frame3").contents().scroll(function () {
                  $("#frame1").contents().scrollTop($("#frame3").contents().scrollTop());
                  $("#frame2").contents().scrollTop($("#frame3").contents().scrollTop());
              });
          }
    }

    deactivateScroll = () => {
        $("#frame1").contents().off( "scroll" );
        $("#frame2").contents().off( "scroll" );
        $("#frame3").contents().off( "scroll" );
    }

    handleCheck = (event) => {
      let checked = event.target.checked;
      console.log(checked);
      if(checked){
         this.activateScroll();
       }
       else{
         this.deactivateScroll();
        }
    }


    render() {
        return (
            <div>
                {this.props.job !== undefined ?
                <Dialog className="main_block" fullScreen TransitionComponent={Transition}
                    open={this.state.open}
                    onClose={this.handleClose}
                    onEntered={this.activateScroll}
                >
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                                <a href="/"><img src={logo} alt="o2r" id="headerLogo" /></a>
                            </Typography>
                            <Button id="close" color="inherit" onClick={this.handleClose}>Close</Button>
                        </Toolbar>
                    </AppBar>
                    {this.props.job.status === 'success' ?
                        <div className="compare_">
                            <h4 className="title" style={{ marginLeft: "1%" }}> Original results </h4>
                            <h4 className="title"> Reproduced results </h4>
                            <Iframe className="display" id={'frame1'} url={config.baseUrl + "job/" + this.props.job.id + "/data/" + this.props.displayfile}></Iframe>
                            <Iframe className="check" id={'frame2'} url={config.baseUrl + "job/" + this.props.job.id + "/data/check.html"}></Iframe>
                        </div> :
                        <div className="compare_">
                            <h4 className="title_" > Original results </h4>
                            <h4 className="title_"> Reproduced results </h4>
                            <h4 className="title_" id="diffCaption"> Differences between original and reproduced results </h4>
                            <Iframe className="display_" id={'frame1'} url={config.baseUrl + "compendium/" + this.props.job.compendium_id + "/data/" + this.props.displayfile}></Iframe>
                            <Iframe className="check_" id={'frame2'} url={config.baseUrl + "job/" + this.props.job.id + "/data/" + this.props.displayfile}></Iframe>
                            <Iframe className="diff" id={'frame3'} url={config.baseUrl + "job/" + this.props.job.id + "/data/check.html"}></Iframe>
                            <h4 className="title_" > To use synchronised scrolling in Firefox, move the cursor to the leftmost document. </h4>
                            <FormControlLabel
                              className = "checkScroll"
                              label = "Synchronised scrolling"
                              labelPlacement = "start"
                              control = {<Checkbox
                                          color="primary"
                                          onChange={this.handleCheck}
                                          defaultChecked/>}
                              />
                        </div>
                    }
                </Dialog> : ""}
            </div>
        );
    }
}

export default withRouter(Comparison);
