import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, Grid, CircularProgress, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

import httpRequests from "../../../../helpers/httpRequests"
import { withRouter } from 'react-router-dom';

import SubstitutionCard from "./substitutionCard"

import "./substitute.css"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Substitute extends Component {

    constructor(props) {
        super(props);
        this.state = {
            substitutedErc: null,
            open: false,
            loading: false,
            substitutionFiles: [],
            baseErcFiles: [],
            substitutionErcFiles: [],
            selectedSubstitutionFiles: [],
            selectedBaseFiles: [],
        }

    }

    componentDidMount() {
        this.checkConfigurationFile();
        let baseErcFiles = [];
        let substitutionErcFiles = [];
        if (!Array.isArray(this.props.erc.inputfiles)) {
            substitutionErcFiles.push(this.props.erc.inputfiles);
        } else {
            substitutionErcFiles  = this.props.erc.inputfiles;
        }
        if (!Array.isArray(this.props.baseErc.inputfiles)) {
            baseErcFiles.push(this.props.baseErc.inputfiles);
        } else {
            baseErcFiles  = this.props.baseErc.inputfiles;
        }
        this.setState({baseErcFiles, substitutionErcFiles})
    }
    handleClose = () => {
        this.props.setErc(0);
    }

    substitute = () => {
        const self = this;
        this.setState({ loading: true })
        httpRequests.createSubstitution(this.props.baseErcId, this.props.ercId, this.state.substitutionFiles)
            .then(function (response) {
                self.setState({ substitutedErc: response.data.id, open: false })
            })
            .catch(function (response) {
                if (response.response.status === 401) {
                    self.setState({ open: true, title: "Request to Server Failed", errorMessage: "You have to be logged in to create a substituted ERC" })
                }
                console.log(response)
            })
    }

    checkConfigurationFile= () =>{
        const self = this;
        httpRequests.singleCompendium(this.props.baseErcId)
        .then(function (response){
                const files = response.data.files.children;
                for (var file of files){
                    if(file.name == "erc.yml"){
                        self.setState({configurationFile:true})
                    }
                }
            })
    }

    goToErc = () => {
        this.handleClose();
        this.props.history.push({
            pathname: '/erc/' + this.state.substitutedErc,
        });
        window.location.reload(true);
    }

    removeSelection = () => {
        this.setState({ substitutionFiles: [], selectedBaseFiles: [], selectedSubstitutionFiles : [] })
    }

    handleChange = (name) => event => {
        const file = event.target.value;
        const substitutionFiles = this.state.substitutionFiles;
        const selectedSubstitutionFiles = this.state.selectedSubstitutionFiles;
        const selectedBaseFiles = this.state.selectedBaseFiles;
        if (name == "substitutionFile") {
            if (this.state.basefile) {
                substitutionFiles.push({ "base": this.state.basefile, "overlay": file })
                selectedSubstitutionFiles.push(file);
                selectedBaseFiles.push(this.state.basefile)
                this.setState({ basefile: null, substitutionFile: null, substitutionFiles, selectedBaseFiles, selectedSubstitutionFiles })
            }
            else {
                this.setState({ [name]: event.target.value })
            }
        }
        else {
            if (this.state.substitutionFile) {
                substitutionFiles.push({ "base": file, "overlay": this.state.substitutionFile })
                selectedBaseFiles.push(file);
                selectedSubstitutionFiles.push(this.state.substitutionFile);
                this.setState({ basefile: null, substitutionFile: null, substitutionFiles, selectedBaseFiles, selectedSubstitutionFiles })
            }
            else {
                this.setState({ [name]: event.target.value });
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
                    <h1 style={{ "margin-top": "5%", "text-align" : "center"}}>Substitution of input data files: Select one dataset of each ERC and then click on "Substitute"</h1>
                    <Grid container spacing={3} direction="row" justify="space-evenly" alignItems="baseline" >
                        <Grid item xs={4} >
                            <SubstitutionCard erc = {this.props.baseErc} selected={this.state.basefile} files={this.state.baseErcFiles} selectedFiles={this.state.selectedBaseFiles} handleChange={() => this.handleChange('basefile')} class={"base"} />
                        </Grid>
                        <Grid item xs={4} >
                        <SubstitutionCard erc = {this.props.erc} selected={this.state.substitutionFile} files={this.state.substitutionErcFiles} selectedFiles={this.state.selectedSubstitutionFiles} handleChange={() => this.handleChange('substitutionFile')} class={"substituted"}/>
                        </Grid>
                    </Grid>
                    <br />
                    <Button style={{ width: "10%", left: "12%" }} variant="contained" color="primary"
                        disabled={this.state.substitutedErc !== null || this.state.substitutionFiles.length === 0}
                        onClick={() => this.removeSelection()}>
                        Remove Selection
                    </Button>
                    <br />
                    <Button style={{ width: "10%", left: "12%" }} variant="contained" color="primary"
                        disabled={this.state.substitutedErc !== null || this.state.substitutionFiles.length === 0 || !this.state.configurationFile}
                        onClick={() => this.substitute()}>
                        Substitute
                    </Button>
                    {!this.state.configurationFile ?
                     <> <br/> <span style={{paddingLeft : "12%", color : "red"}}>
                         Configuration file is missing, so it cannot be included. <br/> Please ensure a successful analysis execution first. 
                         <Button color="primary" onClick={() => this.props.handleTabChange("e",1)}> Go there </Button>
                         </span> </>
                         : ""}
                    {this.state.loading ? <CircularProgress style={{position: "absolute", left: "25%", top: "96%"}}/> : ''}
                    <br />
                    <Button style={{ width: "10%", left: "12%" }} variant="contained" color="primary"
                        disabled={this.state.substitutedErc === null}
                        onClick={() => this.goToErc()}>
                        Go to new ERC
                    </Button>
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
                </Dialog>
            </div>
        )
    }
}


export default withRouter(Substitute);