import React, { Component } from "react";
import { Select, FilledInput } from "@material-ui/core";
import uuid from 'uuid/v1';

class SelectFile extends Component {

    render() {
        const props=this.props;
        return (
            <Select native
                value={props.value}
                onChange={props.handleChange}
                input={<FilledInput name={props.name} id="filled-age-native-simple" />}
            >
                {props.options.map(option => (
                    <option value={option} key={uuid()}>{option}</option>
                ))}
            </Select>
        );
    }
}

export default SelectFile;