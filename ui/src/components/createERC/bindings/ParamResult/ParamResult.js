import React, { Component } from 'react';
import { Select } from "@material-ui/core";

class ParamResult extends Component {

    render() {
        return (
            <div>
                <Select
                  value={this.props.value}
                  onChange={this.props.handleParamChange}
                >
                  <option value=''></option>
                  {this.props.params.map((param,index) => (
                    <option value={param} key={index}>{param.targets[0].id}</option>
                  ))}
                </Select>
            </div>
        );
    }
}

export default ParamResult;