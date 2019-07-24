import React, { Component } from 'react';
import { TextField } from "@material-ui/core";

class SelectedCode extends Component {

    render() {
        return (
            <div>
                <TextField margin="normal" variant="outlined"
                    id={this.props.id}
                    label={this.props.label}
                    value={this.props.value}
                    onChange={this.props.handleChange}
                    InputProps={{
                        readOnly: true,
                      }}
                />
            </div>
        );
    }
}

export default SelectedCode;