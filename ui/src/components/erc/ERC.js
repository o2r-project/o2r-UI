import React from 'react';
import 'react-reflex/styles.css';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import './erc.css';
import httpRequests from '../../helpers/httpRequests';
import MainView from './MainView/MainView';
import CodeView from './CodeView/CodeView';
import DataView from './DataView/DataView';

class ERC extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.match.params.id,
            mainFile: "",
            dataSet: "",
            codeFile: "",
        };
    }

    componentDidMount() {
        this.getMetadata();
    }

    setDataFile(dataFile) {
        const self = this;
        httpRequests.getFile("http://localhost/api/v1/compendium/"+self.state.id+"/data/" + dataFile)
            .then(function(res) {
                httpRequests.getFile("http://localhost/api/v1/compendium/"+self.state.id+"/data/")
                    .then(function(res2) {
                        self.setState({
                            dataSet: {
                                dataFile: dataFile,
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

    setCodeFile(codeFile) {
        this.setState({
            codeFile: codeFile,
        });        
    }

    setMainFile(mainFile) {
        this.setState({
            mainFile: mainFile,
        });        
    }

    getMetadata() {
        const self = this;
        httpRequests.singleCompendium(this.state.id)
            .then(function(response) {
                const data = response.data.metadata.o2r;
                self.setMainFile(data.displayfile);
                self.setDataFile(data.inputfiles[0]);
                self.setCodeFile(data.codefiles[0]);
            })
            .catch(function (response) {
                console.log(response)
            })
    }
  
    render () {

        return (
            <div className="Erc">
                <ReflexContainer style={{ height: "87vh" }} orientation="vertical">
                    <ReflexElement>
                        <MainView filePath={"http://localhost/api/v1/compendium/"+this.state.id+"/data/"+this.state.mainFile}></MainView>
                    </ReflexElement>
                    <ReflexSplitter propagate={true} style={{ width: "10px" }} />
                    <ReflexElement className="right-pane">
                        <ReflexContainer orientation="horizontal">
                            <ReflexElement className="right-up">
                                <CodeView fileName={this.state.codeFile}></CodeView>
                            </ReflexElement>
                            <ReflexSplitter propagate={true} style={{ height: "10px" }} />
                            <ReflexElement className="right-bottom">
                                <DataView data={this.state.dataSet}></DataView>
                            </ReflexElement>
                        </ReflexContainer>
                    </ReflexElement>
                </ReflexContainer>
            </div>
        )
    }
}

export default ERC;