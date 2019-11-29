import React from 'react';
import 'react-reflex/styles.css';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { Paper, Tabs, Tab, Button, IconButton, Grid } from "@material-ui/core";
import GetAppIcon from '@material-ui/icons/GetApp';

import config from '../../helpers/config';
import './erc.css';
import httpRequests from '../../helpers/httpRequests';
import MainView from './MainView/MainView';
import Inspect from './Inspect/Inspect';
import Check from './Check/Check';
import Manipulate from './Manipulate/Manipulate';
import Substitution from './Substitution/Substitution';
import DownloadPop from './Download/DownloadPop';
import SubstitutionInfoPop from './Substitution/SubstitutionInfo'

class ERC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            displayfile: null,
            pdfFile: null,
            dataset: null,
            datafiles: null,
            codefile: null,
            codefiles: null,
            tabValue: 0,
            html: true,
        };
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount = () => this.getMetadata();

    setDataFile(datafile) {
        const self = this;
        httpRequests.getFile("compendium/" + self.state.id + "/data/" + datafile)
            .then(function (res) {
                httpRequests.getFile("compendium/" + self.state.id + "/data/")
                    .then(function (res2) {
                        if (datafile.trim().toLowerCase().indexOf('.rdata') !== -1) {
                            httpRequests.getFile('inspection/' + self.state.id + '?file=' + datafile)
                                .then((res3) => {
                                    self.setState({
                                        dataset: {
                                            datafile: datafile,
                                            data: res3.data,
                                            tree: res2.data.children,
                                        },
                                    });
                                })
                                .catch((res3) => {
                                    console.log(res)
                                })
                        } else {
                            self.setState({
                                dataset: {
                                    datafile: datafile,
                                    data: res.data,
                                    tree: res2.data.children,
                                },
                            });
                        }
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
        httpRequests.getFile("compendium/" + self.state.id + "/data/")
            .then(function (res) {
                const dataset = res.data.children
                const pdfs = [];
                for (var element of dataset) {
                    if (element.extension === ".pdf") {
                        pdfs.push(element)
                    }
                }
                console.log(pdfs)
                if (pdfs.length === 1) {
                    self.setState({ pdfFile: pdfs[0] })
                } else {
                    for (var element of pdfs) {
                        if (element.name === "paper.pdf") {
                            self.setState({ pdfFile: element })
                        }
                    }
                }
            })
            .catch((res) => {
                console.log(res)
            })
    }

    handleDataChange = (evt) => this.setDataFile(evt.target.value);
    handleCodeChange = (evt) => this.setCodeFile(evt.target.value);

    getMetadata() {
        const self = this;
        httpRequests.singleCompendium(this.state.id)
            .then(function (response) {
                console.log(response.data)
                let substituted = null;
                if (response.data.substituted) {
                    substituted = response.data.metadata.substitution
                }
                const data = response.data.metadata.o2r;
                let dataset = '';
                if (Array.isArray(data.inputfiles)) {
                    dataset = data.inputfiles[0];
                } else {
                    dataset = data.inputfiles;
                }
                self.setState({
                    metadata: data,
                    datafiles: data.inputfiles,
                    dataset: dataset,
                    codefiles: data.codefiles,
                    binding: data.interaction[0],
                    substituted: substituted
                });
                self.setDisplayFile(data.displayfile);
                if (Array.isArray(data.inputfiles)) {
                    self.setDataFile(data.inputfiles[0]);
                } else {
                    self.setDataFile(data.inputfiles);
                }
                self.setCodeFile(data.mainfile);
                self.setPdfFile();
            })
            .catch(function (response) {
                console.log(response)
            })
    }

    handleTabChange = (e, newValue) => {
        this.setState({
            tabValue: newValue,
        })
    }

    handleDisplayFile() {
        this.setState({
            html: !this.state.html
        })
    }

    openPop = (name) => {
        this.setState({ [name]: true })
    }

    handleClose() {
        this.setState({ downloadOpen: false, substitutionInfoOpen: false })
    }

    render() {
        return (
            <div className="Erc" >
                <ReflexContainer style={{ height: "87vh" }} orientation="vertical">
                    <ReflexElement>
                        <Grid container>
                            <Grid item xs={4}>
                                {this.state.substituted ?
                                    <span style={{ float: "left" }}>
                                        <span style={{ top: "1px", position: "relative" }}> This is an substituted ERC</span>
                                        <Button onClick={() => this.openPop("substitutionInfoOpen")}>More Info</Button>
                                    </span>
                                    : ""}
                            </Grid>
                            {this.state.substitutionInfoOpen ? <SubstitutionInfoPop substitution={this.state.substituted} open={this.state.substitutionInfoOpen} handleClose={this.handleClose} /> : ""}
                            <Grid item xs={4}>
                                <Button
                                    onClick={this.handleDisplayFile.bind(this)}
                                    variant='contained'
                                    color='inherit'
                                    style={{ float: "center" }}
                                >
                                    {this.state.html ? 'Show PDf' : 'Show HTML'}
                                </Button>
                            </Grid>
                            <Grid xs={4}>
                                <IconButton size='large' style={{ float: "right" }} onClick={() => this.openPop("downloadOpen")}>
                                    <GetAppIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        {this.state.downloadOpen ? <DownloadPop id={this.state.id} open={this.state.downloadOpen} handleClose={this.handleClose} /> : ""}
                        {this.state.displayfile != null
                            ? <MainView
                                metadata={this.state.metadata}
                                handleTabChange={this.handleTabChange}
                                filePath={this.state.html
                                    ? config.baseUrl + "compendium/" + this.state.id + "/data/" + this.state.displayfile
                                    : this.state.pdfFile !== null ? this.state.pdfFile.path : this.state.metadata.identifier.doiurl}>
                            </MainView>
                            : <div>There is no file to display</div>}
                    </ReflexElement>
                    <ReflexSplitter propagate={true} style={{ width: "10px" }} />
                    <ReflexElement>
                        <Paper square>
                            <Tabs indicatorColor="primary" textColor="primary"
                                onChange={this.handleTabChange.bind(this)}
                                value={this.state.tabValue}
                            >
                                <Tab label="Inspect" />
                                <Tab label="Check" />
                                <Tab label="Manipulate" />
                                <Tab label="Substitution" />
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
                                <Check id={this.state.id}></Check>
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
                                <Substitution baseErcMetadata={this.state.metadata} baseErcId={this.state.id} />
                            </div>
                        }
                    </ReflexElement>
                </ReflexContainer>
            </div>
        )
    }
}

export default ERC;
