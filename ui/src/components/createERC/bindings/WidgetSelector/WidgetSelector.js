import React, { Component } from 'react';
import { FormControlLabel, Radio } from "@material-ui/core";

class WidgetSelector extends Component {

    render() {
        return (
                <FormControlLabel
                id={this.props.id}
                  value={this.props.value}
                  control={<Radio color="primary" />}
                  label={this.props.label}
                  labelPlacement="start"
                />
        );
    }
}

export default WidgetSelector;