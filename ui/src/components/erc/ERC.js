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
            dataFile: "",
            codeFile: "",
        };
    }

    componentDidMount() {
        this.getMetadata();
    }

    setFiles(main, data, code) {
        this.setState({
            mainFile: main,
            dataFile: data,
            codeFile: code,
        })
    }

    getMetadata() {
        const self = this;
        httpRequests.singleCompendium(this.state.id)
            .then(function(response) {
                const data = response.data.metadata.o2r;
                self.setFiles(data.displayfile, data.inputfiles[0], data.codefiles[0]);
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
                        <MainView fileName={this.state.mainFile}></MainView>
                    </ReflexElement>
                    <ReflexSplitter propagate={true} style={{ width: "10px" }} />
                    <ReflexElement className="right-pane">
                        <ReflexContainer orientation="horizontal">
                            <ReflexElement className="right-up">
                                <CodeView fileName={this.state.codeFile}></CodeView>
                            </ReflexElement>
                            <ReflexSplitter propagate={true} style={{ height: "10px" }} />
                            <ReflexElement className="right-bottom">
                                <DataView fileName={this.state.dataFile}></DataView>
                            </ReflexElement>
                        </ReflexContainer>
                    </ReflexElement>
                </ReflexContainer>
            </div>
        )
  }
}

export default ERC;