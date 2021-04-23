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
                  id="selectFigure"
                >
                  <option value=''></option>
                  {this.props.figures.map((figure,index) => (
                    <option value={figure.plotFunction} key={index}>{figure.plotFunction}</option>
                  ))}
                </Select>
            </div>
        );
    }
}

export default ComputationalResult;