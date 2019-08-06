import React, { Component } from "react";
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import CodeView from './CodeView/CodeView';
import DataView from './DataView/DataView';
import SelectFile from './SelectFile/SelectFile';

class Inspect extends Component {

    render() {
        const props=this.props.state;
        return (
            <ReflexContainer orientation="horizontal">
                <ReflexElement>
                    {props.codefiles != null && props.codefile != null ? 
                    <SelectFile value={props.codefile.filename} handleChange={this.props.handleCodeChange} options={props.codefiles} name="codefile" />
                    : ''}
                    {props.codefile != null ? 
                        <CodeView code={props.codefile.file.data}></CodeView> : <div>There is no data to display</div>}
                </ReflexElement>
                <ReflexSplitter propagate={true} style={{ height: "10px" }} />
                <ReflexElement>
                    {props.dataset != undefined ? 
                    <SelectFile value={props.dataset.datafile} handleChange={this.props.handleDataChange} options={props.datafiles} name="dataset" />
                    : ''}
                    {props.dataset != null ? 
                        <DataView data={props.dataset}></DataView> : <div>There is no data to display</div>}
                </ReflexElement>
            </ReflexContainer>
        );
    }
}

export default Inspect;