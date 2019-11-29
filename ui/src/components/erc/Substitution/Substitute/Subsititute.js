import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, Card, CardHeader, CardContent, Grid, CircularProgress, Checkbox } from "@material-ui/core";

import httpRequests from "../../../../helpers/httpRequests"
import { withRouter } from 'react-router-dom';

import "./substitute.css"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Substitute extends Component {

    constructor(props) {
        super(props);
        this.state = {substitutedErc : null,
                      open: false,
                      selected : [],
                      substitutionFiles : []}

    }

    handleClose = () => {
        this.props.setErc(0);
    }

    substitute = () =>{
        const self =this;
        this.setState({open:true})
        httpRequests.createSubstitution(this.props.baseErcId, this.props.ercId, this.state.substitutionFiles)
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

    removeSelection = ()=>{
        this.setState({substitutionFiles: [], selected:[]})   
    }

    handleChange = (name) => event =>{
        const file =event.target.value;
        const substitutionFiles = this.state.substitutionFiles;
        const selected = this.state.selected;
        if(name == "substitutionFile"){
            if(this.state.basefile){
                substitutionFiles.push({"base" : this.state.basefile, "overlay":file })
                selected.push(file);
                selected.push(this.state.basefile)
                this.setState({basefile: null, substitutionFile: null, substitutionFiles, selected})
            }
            else{
                this.setState({[name]: event.target.value})
            }
        }
        else{
            if(this.state.substitutionFile){
                substitutionFiles.push({"base" : file, "overlay": this.state.substitutionFile })
                selected.push(file);
                selected.push(this.state.substitutionFile)
                this.setState({basefile: null, substitutionFile: null, substitutionFiles, selected})
            }
            else{
                this.setState({[name]: event.target.value})
            }
        }
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
                                    <><Card className={"class" + Math.ceil((this.state.selected.indexOf(datafile)+1)/2)} style={{width:"70%", "margin-left": "15%"}}>
                                        <CardContent style={{"padding-bottom":"16px"}}>
                                            <Grid container>
                                                <Grid item xs={10}>
                                                     <p style={{"top": "40%"}}>{datafile}</p>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Checkbox
                                                        style={{"top": "11%"}}
                                                        checked={datafile === this.state.basefile}
                                                        onChange={this.handleChange('basefile')}
                                                        value={datafile}
                                                        color="primary"
                                                        disabled={this.state.selected.includes(datafile)}
                                                    />
                                                </Grid>
                                             </Grid>
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
                                    <><Card className={"class" + Math.ceil((this.state.selected.indexOf(datafile)+1)/2)} style={{width:"70%", "margin-left": "15%"}}>
                                        <CardContent style={{"padding-bottom":"16px"}}>
                                            <Grid container>
                                                <Grid item xs={10}>
                                                     <p style={{"top": "40%"}}>{datafile}</p>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Checkbox
                                                        style={{"top": "11%"}}
                                                        checked={datafile===this.state.substitutionFile}
                                                        onChange={this.handleChange('substitutionFile')}
                                                        value={datafile}
                                                        color="primary"
                                                        disabled={this.state.selected.includes(datafile)}
                                                    />
                                                </Grid>
                                             </Grid>
                                        </CardContent>
                                    </Card>
                                    <br/></>
                                    ))}
                            </Card>
                        </Grid>
                    </Grid>
                    <br/>
                    <Button style={{width: "10%", left: "12%"}} variant="contained" color="primary" 
                    disabled={this.state.substitutedErc !== null || this.state.substitutionFiles.length ===0}
                    onClick={() => this.removeSelection()}>
                        Remove Selection
                    </Button>
                    <br/>
                    <Button style={{width: "10%", left: "12%"}} variant="contained" color="primary" 
                    disabled={this.state.substitutedErc !== null || this.state.substitutionFiles.length ===0}
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