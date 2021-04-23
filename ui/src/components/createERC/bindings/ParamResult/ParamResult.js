import React, { Component } from 'react';
import { Select, MenuItem } from "@material-ui/core";

class ParamResult extends Component {

    render() {
        return (
            <div>
                <Select
          
                  value={this.props.value}
                  onChange={this.props.handleParamChange}
                  style={{minWidth : "30%"}}
                  id="selectP"
                >
                  <MenuItem value=''></MenuItem>
                  {this.props.params.map((param,index) => (
                    <MenuItem value={param}>{param.targets[0].id}</MenuItem>
                  ))}
                </Select>
            </div>
        );
    }
}

export default ParamResult;