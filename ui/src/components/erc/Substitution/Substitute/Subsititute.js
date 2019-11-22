import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, Card, CardHeader, CardContent, Grid, CircularProgress } from "@material-ui/core";

import httpRequests from "../../../../helpers/httpRequests"
import { withRouter } from 'react-router-dom';

import "./substitute.css"

const substitutionFiles = [{ "base": "data.csv", "overlay": "data.csv"}]

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Substitute extends Component {

    constructor(props) {
        super(props);
        this.state = {substitutedErc : null, open: false}
    }

    handleClose = () => {
        this.props.setErc(0);
    }

    substitute = () =>{
        const self =this;
        this.setState({open:true})
        httpRequests.createSubstitution(this.props.baseErcId, this.props.ercId, substitutionFiles)
            .then(function (response) {
                self.setState({substitutedErc : response.data.id, open: false})
            })
            .catch(function (response) {
                console.log(response)
            })
    
    }

    goToErc = () =>{
        this.handleClose();
        this.props.history.push({
            pathname: '/erc/' + this.state.substitutedErc,
          });
    }

    render() {


        return (
            <div>
                <Dialog className="main_block" fullScreen TransitionComponent={Transition}
                    open={this.props.erc !== 0}
                >
                    <AppBar>
                        <Toolbar>
                            <Button color="inherit" onClick={() => this.handleClose()}>Close</Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={3} direction="row" justify="space-evenly" alignItems="baseline" style={{"margin-top" : "10%"}}>
                        <Grid item xs={4} >
                            <Card >
                                <CardHeader title={"Base ERC: " + this.props.baseErc.title}>
                                </CardHeader>
                                {this.props.baseErc.inputfiles.map((datafile, index) => (
                                    <><Card style={{width:"70%", "margin-left": "15%"}}>
                                        <CardContent>
                                        {datafile}
                                        </CardContent>
                                    </Card>
                                    <br/></>
                                    ))}
                            </Card>
                        </Grid>
                        <Grid item xs={4} >
                            <Card >
                                <CardHeader title={"Substitute ERC: " + this.props.erc.title}>
                                </CardHeader>
                                    {this.props.erc.inputfiles.map((datafile, index) => (
                                    <><Card style={{width:"70%", "margin-left": "15%"}}>
                                        <CardContent>
                                        {datafile}
                                        </CardContent>
                                    </Card>
                                    <br/></>
                                    ))}
                            </Card>
                        </Grid>
                    </Grid>
                    <br/>
                    <Button style={{width: "10%", left: "12%"}} variant="contained" color="primary" 
                    disabled={this.state.substitutedErc !== null || substitutionFiles.length ===0}
                    onClick={() => this.substitute()}>
                        Substitute
                    </Button>
                    {this.state.open? <CircularProgress /> : ''}
                    <br/>
                    <Button style={{width: "10%", left: "12%"}} variant="contained" color="primary" 
                    disabled={this.state.substitutedErc === null}
                    onClick={() => this.goToErc()}>
                        Go to new ERC
                    </Button>
                </Dialog>
            </div>
        )
    }
}


export default withRouter(Substitute);