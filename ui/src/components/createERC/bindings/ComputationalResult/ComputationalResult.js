import React, { Component } from 'react';
import { Select } from "@material-ui/core";

class ComputationalResult extends Component {

    render() {
      console.log(this.props)
        return (
            <div>
                <Select
                  native
                  value={this.props.value}
                  onChange={this.props.handleResultChange}
                >
                  {this.props.figures.map((figure,index) => (
                    <option value={figure}>{figure}</option>
                  ))}
                </Select>
            </div>
        );
    }
}

export default ComputationalResult;