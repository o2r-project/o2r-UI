import React, { Component } from "react";
import { InputLabel, FormControl, Select, FilledInput } from "@material-ui/core";
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import uuid from 'uuid/v1';

import CodeView from '../CodeView/CodeView';
import DataView from '../DataView/DataView';

class Inspect extends Component {

    render() {
        const props=this.props.state;
        return (
            <ReflexContainer orientation="horizontal">
                <ReflexElement>
                    {props.codefiles != null && props.codefile != null ? 
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                            <Select
                                native
                                value={props.codefile.filename}
                                onChange={this.props.handleCodeChange}
                                input={<FilledInput name="codefile" id="filled-age-native-simple" />}
                            >
                                {props.codefiles.map(option => (
                                    <option value={option} key={uuid()}>{option}</option>
                                ))}
                            </Select>
                        </FormControl> : ''}
                    {props.codefile != null ? <CodeView code={props.codefile.file.data}></CodeView> : <div>There is no data to display</div>}
                </ReflexElement>
                <ReflexSplitter propagate={true} style={{ height: "10px" }} />
                <ReflexElement>
                    {props.dataset != undefined ? 
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                            <Select
                                native
                                value={props.dataset.datafile}
                                onChange={props.handleDataChange}
                                input={<FilledInput name="dataset" id="filled-age-native-simple" />}
                            >
                                {props.datafiles.map(option => (
                                    <option value={option} key={uuid()}>{option}</option>
                                ))}
                            </Select>
                        </FormControl> : ''}
                    {props.dataset != null ? <DataView data={props.dataset}></DataView> : <div>There is no data to display</div>}
                </ReflexElement>
            </ReflexContainer>
        );
    }
}

export default Inspect;