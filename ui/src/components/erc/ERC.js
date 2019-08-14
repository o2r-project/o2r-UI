import React from 'react';
import 'react-reflex/styles.css';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { Paper, Tabs, Tab, Button } from "@material-ui/core";

import config from '../../helpers/config';
import './erc.css';
import httpRequests from '../../helpers/httpRequests';
import MainView from './MainView/MainView';
import Inspect from './Inspect/Inspect';
import Check from './Check/Check';
import Manipulate from './Manipulate/Manipulate';

class ERC extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.match.params.id,
            displayfile: null,
            dataset: null,
            datafiles: null,
            codefile: null,
            codefiles: null,
            tabValue: 0,
            html:true,
        };  
    }

    componentDidMount = () => this.getMetadata();

    setDataFile(datafile) {
        const self = this;
        httpRequests.getFile("compendium/" + self.state.id + "/data/" + datafile)
            .then(function(res) {
                httpRequests.getFile("compendium/" + self.state.id + "/data/")
                    .then(function(res2) {
                        self.setState({
                            dataset: {
                                datafile: datafile,
                                data: res.data,
                                tree: res2.data.children,
                            },
                        });
                    })
                    .catch(function(res2) {
                        console.log(res2)
                    })   
            })
            .catch(function(res) {
                console.log(res)
            })
    }

    setCodeFile(codefile) {
        const self = this;
        httpRequests.getFile("compendium/" + self.state.id + "/data/" + codefile)
        .then(function(res) {
            self.setState({
                codefile:{
                    filename:codefile,
                    file:res,
                },
            });
        })
        .catch(function(res) {
            console.log(res)
        })
    }

    setDisplayFile(displayfile) {
        this.setState({
            displayfile: displayfile,
        });        
    }

    handleDataChange = ( evt ) => this.setDataFile(evt.target.value);
    handleCodeChange = ( evt ) => this.setCodeFile(evt.target.value);

    getMetadata () {
        const self = this;
        httpRequests.singleCompendium(this.state.id)
            .then(function(response) {
                const data = response.data.metadata.o2r;
                console.log(response)
                self.setState({
                    metadata: data,
                    datafiles: data.inputfiles,
                    dataset: data.inputfiles[0],
                    codefiles: data.codefiles,
                    binding:data.interaction[0],
                });
                self.setDisplayFile(data.displayfile);
                if ( data.inputfiles.length > 0 ) {
                    self.setDataFile(data.inputfiles[0]);
                }
                self.setCodeFile(data.mainfile);
            })
            .catch(function (response) {
                console.log(response)
            })
    }

    handleTabChange = ( e, newValue ) => {
        this.setState({
            tabValue: newValue,
        })
    }

    handleDisplayFile () {
        this.setState({
            html: !this.state.html
        })
    }
  
    render () {
        return (
            <div className="Erc" >
                <ReflexContainer style={{ height: "87vh" }} orientation="vertical">
                    <ReflexElement>
                        <Button onClick={this.handleDisplayFile.bind(this)}>{this.state.html ? 'Show PDf' : 'Show HTML'}</Button>
                        {this.state.displayfile!=null 
                        ?<MainView 
                            filePath={this.state.html 
                                ? config.baseUrl + "compendium/" + this.state.id + "/data/" + this.state.displayfile
                                : this.state.metadata.identifier.doiurl}>
                        </MainView> 
                        :<div>There is no file to display</div>}
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
                                <Manipulate bindings={this.state.metadata.interaction}></Manipulate>
                                : 'No interactive figures were made for this paper'}
                            </div>
                        }
                    </ReflexElement>
                </ReflexContainer>
            </div>
        )
    }
}

export default ERC;
