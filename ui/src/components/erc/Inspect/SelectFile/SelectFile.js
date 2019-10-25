import React, { Component } from "react";
import { Select, FilledInput, InputLabel, FormControl } from "@material-ui/core";

class SelectFile extends Component {

    render() {
        const props=this.props;
        return (
            <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                <Select native
                    value={props.value}
                    onChange={props.handleChange}
                    input={<FilledInput name={props.name} id="filled-age-native-simple" />}
                >
                    {props.options.map((option, index) => (
                        <option value={option} key={index}>{option}</option>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default SelectFile;