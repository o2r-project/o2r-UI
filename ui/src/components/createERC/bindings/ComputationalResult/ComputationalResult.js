import React, { Component } from 'react';
import { Select } from "@material-ui/core";

class ComputationalResult extends Component {

    render() {
        return (
            <div>
                <Select
                  native
                  value={this.props.value}
                  onChange={this.props.handleResultChange}
                >
                  <option value='' />
                  <option value='Figure 1'>Figure 1</option>
                  <option value='Figure 2'>Figure 2</option>
                  <option value='Figure 3'>Figure 3</option>
                </Select>
            </div>
        );
    }
}

export default ComputationalResult;