import React, { Component } from "react";
import { InputLabel, FormControl, Select, FilledInput } from "@material-ui/core";
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import uuid from 'uuid/v1';

import CodeView from '../CodeView/CodeView';
import DataView from '../DataView/DataView';

class Inspect extends Component {

    constructor(props) {
        super(props);
    }

    render() {
 
        return (
            <ReflexContainer orientation="horizontal">
                <ReflexElement>
                    {this.props.props.codefiles != null && this.props.props.codefile != null ? 
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                            <Select
                                native
                                value={this.props.props.codefile.filename}
                                onChange={this.props.handleCodeChange}
                                input={<FilledInput name="codefile" id="filled-age-native-simple" />}
                            >
                                {this.props.props.codefiles.map(option => (
                                    <option value={option} key={uuid()}>{option}</option>
                                ))}
                            </Select>
                        </FormControl> : ''}
                    {this.props.props.codefile != null ? <CodeView code={this.props.props.codefile}></CodeView> : <div>There is no data to display</div>}
                </ReflexElement>
                <ReflexSplitter propagate={true} style={{ height: "10px" }} />
                <ReflexElement>
                    {this.props.props.datafiles != null ? 
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                            <Select
                                native
                                value={this.props.props.dataset.datafile}
                                onChange={this.props.handleDataChange}
                                input={<FilledInput name="dataset" id="filled-age-native-simple" />}
                            >
                                {this.props.props.datafiles.map(option => (
                                    <option value={option} key={uuid()}>{option}</option>
                                ))}
                            </Select>
                        </FormControl> : ''}
                    {this.props.props.dataset != null ? <DataView data={this.props.props.dataset}></DataView> : <div>There is no data to display</div>}
                </ReflexElement>
            </ReflexContainer>
        );
    }
}

export default Inspect;











