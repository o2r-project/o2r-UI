import React from 'react';
import 'react-reflex/styles.css';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { Paper, Tabs, Tab, Button, IconButton, Grid, Dialog, DialogActions, DialogTitle, Icon, Box} from "@material-ui/core";
import GetAppIcon from '@material-ui/icons/GetApp';

import './erc.css';
import httpRequests from '../../helpers/httpRequests';
import MainView from './MainView/MainView';
import Inspect from './Inspect/Inspect';
import Check from './Check/Check';
import Manipulate from './Manipulate/Manipulate';
import Substitution from './Substitution/Substitution';
import DownloadPop from './Download/DownloadPop';
import SubstitutionInfoPop from './Substitution/SubstitutionInfo';
import Metadata from './Metadata/Metadata';
import Shipment from './Shipment/Shipment';
import { withRouter } from 'react-router-dom';
import Doilogo from '../../assets/img/DOI_logo.svg.png';



class ERC extends React.Component {
    constructor(props) {
        super(props);
        // To define the id the user has different possibilities: The Id can be defined in the config.js. If there the Id is not defined the id is taken from the url.
        this.state = {
            failure: false,
            id: this.props.id ? this.props.id: this.props.location.state ? this.props.location.state.id  ? this.props.location.state.id : this.props.match.params.id : this.props.match.params.id ,
            displayfile: null,
            pdfFile: null,
            dataset: null,
            datafiles: null,
            codefile: null,
            codefiles: null,
            tabValue: 0,
            html: true,
            pdf: true,
            isPreview: false,
            doiurl: false,
            publicLink: false,
            publisher: null,
        };
        this.handleClose = this.handleClose.bind(this);
        this.tabs  =["Inspect", "Check", "Manipulate", "Substitution", "Metadata", "Shipment" ]
    }

    componentDidMount = () => {
      this.getMetadata();
      document.title = "ERC " + this.state.id + config.title; // eslint-disable-line
     };

     checkHash(){
        let hash = this.props.location.hash;
        hash = hash.substring(1, hash.length)
        let tab = this.tabs.indexOf(hash)
        if(tab === -1){
            tab=0
        }
        this.setState({
          tabValue: tab,
      })
     }


    setDataFile(datafile) {
        const self = this;
        httpRequests.getFile("compendium/" + self.state.id + "/data/" + datafile)
            .then(function (res) {
                httpRequests.getFile("compendium/" + self.state.id + "/data/")
                    .then(function (res2) {
                            self.setState({
                                dataset: {
                                    datafile: datafile,
                                    data: res.data,
                                    tree: res2.data.children,
                                },
                            });
                    })
                    .catch(function (res2) {
                        console.log(res2)
                    })
            })
            .catch(function (res) {
                console.log(res)
            })
    }

    setCodeFile(codefile) {
        const self = this;
        httpRequests.getFile("compendium/" + self.state.id + "/data/" + codefile)
            .then(function (res) {
                self.setState({
                    codefile: {
                        filename: codefile,
                        file: res,
                    },
                });
            })
            .catch(function (res) {
                console.log(res)
            })
    }

    setDisplayFile(displayfile) {
        this.setState({
            displayfile: displayfile,
        });
    }

    setPdfFile() {
        const self = this;
        let set = false;
        httpRequests.getFile("compendium/" + self.state.id + "/data/")
            .then(function (res) {
                const dataset = res.data.children
                const pdfs = [];
                for (var element of dataset) {
                    if (element.extension === ".pdf") {
                        pdfs.push(element)
                    }
                }
                if (pdfs.length === 1) {
                    self.setState({ pdfFile: pdfs[0] })
                    set = true;
                } else {
                    for (var element1 of pdfs) {
                        if (element1.name === "paper.pdf") {
                            self.setState({ pdfFile: element1 })
                            set = true;
                        }
                    }
                }
                if (!set && !self.state.metadata.identifier.doiurl) {
                    self.setState({ pdf: false })
                }
            })
            .catch((res) => {
                if (!this.state.metadata.identifier.doiurl) {
                    self.setState({ pdf: false })
                }
            })

    }

    handleDataChange = (evt) => this.setDataFile(evt.target.value);
    handleCodeChange = (evt) => this.setCodeFile(evt.target.value);

    getMetadata() {
        const self = this;
        httpRequests.singleCompendium(this.state.id)
            .then(function (response) {
                let substituted = null;
                if (response.data.substituted) {
                    substituted = response.data.metadata.substitution
                }
                let candidate = response.data.candidate
                const data = response.data.metadata.o2r;
                data["creators"] = response.data.metadata.raw ? response.data.metadata.raw.author : response.data.metadata.o2r.creators
                let dataset = '';
                if (Array.isArray(data.inputfiles)) {
                    dataset = data.inputfiles[0];
                } else {
                    dataset = data.inputfiles;
                }
                self.setState({
                    failure: false,
                    data: response.data,
                    metadata: data,
                    datafiles: data.inputfiles,
                    dataset: dataset,
                    codefiles: data.codefiles,
                    binding: data.interaction[0],
                    substituted: substituted,
                    isPreview: response.data.candidate,
                    candidate: candidate,
                    doiurl: data.identifier.doiurl,
                    publisher:  response.data.user
                }, () => { 
                self.setDisplayFile(data.displayfile);
                if (Array.isArray(data.inputfiles)) {
                    self.setDataFile(data.inputfiles[0]);
                } else {
                    self.setDataFile(data.inputfiles);
                }
                self.setCodeFile(data.mainfile);
                self.setPdfFile();
                self.proofPublicLink();
                self.checkHash();
                })
            })
            .catch(function (response) {
                self.setState({ failure: true })
                console.log(response)
            })
    }

    proofPublicLink = () =>{
        const self = this;
        httpRequests.getPublicLinks()
            .then( response => {
                for (let result of response.data.results){
                    if (result.compendium_id === this.state.id){
                        self.setState({publicLink : result.id})
                    }
                }
            })
            .catch(function (response) {
                console.log(response)
            })
    }


    handleTabChange = (e, newValue) => {

    
        let hash = "#"
        hash += this.tabs[newValue]
        this.props.history.replace({hash: hash})
        this.setState({
            tabValue: newValue,
        })
    }

    handleDisplayFile() {
        this.setState({
            html: !this.state.html
        })
    }

    handlePublicLink(){
        if(this.state.publicLink){
            this.setState({publicLink: false})
            httpRequests.deletePublicLink(this.state.id)
        }
        else{
            httpRequests.createPublicLink(this.state.id)
                .then( response => this.setState({publicLink: response.data.id}))
        }
    }

    openPop = (name) => {
        this.setState({ [name]: true })
    }

    handleClose() {
        this.setState({ downloadOpen: false, substitutionInfoOpen: false })
    }

    handleAlertClose() {
        this.props.history.push({
            pathname: '/'
        });
    }

    goToEdit(){
        this.props.history.push({
            pathname: '/createErc/' + this.state.id
        });
    }




    render() {
        return (
            <div className="Erc" >
              {this.state.isPreview ? <div><Box
                                          color="white"
                                          textAlign="center"
                                          bgcolor="warning.main"
                                          width={1/3}
                                          border={1}
                                          borderRadius={4}
                                          mx="auto"
                                          my={2}
                                          style={{display: 'inline-block'}}
                                          >
                                          <p><b>This is a preview! Changes from the create window will not be displayed.</b></p>
     
                                      </Box> 
                                      {this.props.userLevel >100 || this.state.publisher === this.props.orcid  ? 
                    <Button onClick={() => this.goToEdit()}
                        style={{marginLeft: '10px'}}
                        variant='contained'
                        color = "primary"> Edit Metadata </Button> 
                        : ""}
 </div> 
                : ""}
                <Box  borderTop={1} borderColor="silver"> 
                <ReflexContainer style={this.props.ojsView? {height: "calc(100vh - 2.5rem)"}:{ height: "calc(100vh - 2.5rem - 64px)" }} orientation="vertical">
                    <ReflexElement style={{ overflow: "hidden" }}>
                        <Grid container>
                            <Grid item xs={4}>
                                {this.state.doiurl ?
                                    <Button
                                        onClick={() => window.location.href= this.state.doiurl}
                                        variant='contained'
                                        color='inherit'
                                        style={{ float: "center" }}
                                        startIcon={<Icon>
                                            <img src={Doilogo} height={20} width={20} alt="DOI"/>
                                        </Icon>}
                                    >
                                        Article
                                    </Button> : ""}
                            </Grid>
                            {this.state.substitutionInfoOpen ? <SubstitutionInfoPop substitution={this.state.substituted} open={this.state.substitutionInfoOpen} handleClose={this.handleClose} /> : ""}
                            <Grid item xs={4}>
                                {this.state.pdf ?
                                    <Button
                                        onClick={this.handleDisplayFile.bind(this)}
                                        variant='contained'
                                        color = "inherit"
                                        style={{ float: "center" }}
                                    >
                                        {this.state.html ? 'Show PDf' : 'Show HTML'}
                                    </Button> : ""}
                            </Grid>
                            <Grid item xs={4}>
                                <IconButton size='medium' label='Download' style={{ float: "right" }} onClick={() => this.openPop("downloadOpen")}>
                                    Download<GetAppIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={3}>
                                {this.state.substituted ?
                                    <span style={{ float: "left" }}>
                                        <span style={{ top: "1px", position: "relative" }}> This is a substituted ERC</span>
                                        <Button onClick={() => this.openPop("substitutionInfoOpen")}>More Info</Button>
                                    </span>
                                    : ""}
                            </Grid>
                            {this.state.substitutionInfoOpen ? <SubstitutionInfoPop substitution={this.state.substituted} open={this.state.substitutionInfoOpen} handleClose={this.handleClose} /> : ""}
                            <Grid item xs={6}>
                                {this.state.publicLink && this.props.userLevel > 0 ?
                                    <span >
                                        <span style={{ top: "1px", position: "relative" }}> This ERC has an public Link: </span>
                                        <a href={config.ercUrl + this.state.publicLink}> {config.ercUrl + this.state.publicLink // eslint-disable-line
                                        } </a> 
                                    </span>
                                    : ""}
                            </Grid>
                            <Grid item xs={3}>
                                {this.state.candidate && this.props.userLevel > 100 ?
                                    <span style={{ float: "right" }}>
                                        <Button variant='contained' onClick={() => this.handlePublicLink()}>{this.state.publicLink ? "Delete public Link" : "Create public Link" } </Button>
                                    </span>
                                    : ""}
                            </Grid>
                        </Grid>
                        {this.state.downloadOpen ? <DownloadPop id={this.state.id} open={this.state.downloadOpen} handleClose={this.handleClose} /> : ""}
                        {this.state.displayfile != null
                            ? <MainView
                                metadata={this.state.metadata}
                                handleTabChange={this.handleTabChange}
                                filePath={this.state.html
                                    ? config.baseUrl + "compendium/" + this.state.id + "/data/" + this.state.displayfile // eslint-disable-line
                                    : this.state.pdfFile !== null ? this.state.pdfFile.path : this.state.metadata.identifier.doiurl}>
                            </MainView>
                            : <div>There is no file to display</div>}
                    </ReflexElement>
                    <ReflexSplitter propagate={true} style={{ width: "10px" }} />
                    <ReflexElement >
                        <Paper square>
                            <Tabs indicatorColor="primary" textColor="primary"
                                onChange={this.handleTabChange.bind(this)}
                                value={this.state.tabValue}
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                {this.tabs.map((name) => (
                                    <Tab label={name} id={name.toLocaleLowerCase()}></Tab>
                                ))}
                            </Tabs>
                        </Paper>
                        {this.state.tabValue === 0 &&
                            <Inspect
                                state={this.state}
                                handleDataChange={this.handleDataChange.bind(this)}
                                handleCodeChange={this.handleCodeChange.bind(this)}
                                handleTabChange={this.handleTabChange}
                            >
                            </Inspect>
                        }
                        {this.state.tabValue === 1 &&
                            <div>
                                <Check id={this.state.id} displayfile={this.state.displayfile}></Check>
                            </div>
                        }
                        {this.state.tabValue === 2 &&
                            <div>
                                {this.state.metadata.interaction.length > 0 ?
                                    <Manipulate bindings={this.state.metadata.interaction} id={this.state.id} />
                                    : 'No interactive figures were made for this paper'}
                            </div>
                        }
                        {
                            this.state.tabValue === 3 &&
                            <div>
                                <Substitution baseErcData={this.state.data} baseErcId={this.state.id} handleTabChange={this.handleTabChange} />
                            </div>
                        }
                         {
                            this.state.tabValue === 4 &&
                            <div>
                                <Metadata erc={this.state.data} substitution={this.state.substituted}/>
                            </div>
                        }
                       {
                            this.state.tabValue === 5 &&
                            <div>
                                <Shipment erc={this.state.data} getMetadata={() => this.getMetadata()}/>
                            </div>
                        }
                    </ReflexElement>
                </ReflexContainer>
                </Box>
                <Dialog
                    open={this.state.failure}
                    onClose={this.handleAlertClose.bind(this)}>
                    {this.props.ojsView ? <div>
                    <DialogTitle>
                        {"The ERC with the ID " + this.state.id + " does not exist or was deleted. \n Please check if you used the correct ID."}
                                    </DialogTitle>
                                    <DialogActions>
                                        {this.props.ojsView ? "" :<Button onClick={this.handleAlertClose.bind(this)}> Go To the ERC Overview Page</Button>}
                                    </DialogActions>
                                    </div>
                    :
                    <div>
                    <DialogTitle>
                        {"The ERC with the ID " + this.state.id + " does not exist or was deleted. \n Please select another ERC."}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleAlertClose.bind(this)}> Go To Home Page</Button>
                    </DialogActions>
                    </div>}
                </Dialog>
            </div>
        )
    }
}

export default withRouter(ERC);
