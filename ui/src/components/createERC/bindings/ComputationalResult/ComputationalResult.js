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
                  <option value=''></option>
                  {this.props.figures.map((figure,index) => (
                    <option value={figure.figure} key={index}>{figure.figure}</option>
                  ))}
                </Select>
            </div>
        );
    }
}

export default ComputationalResult;