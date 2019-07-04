import React, { Component } from "react";
import { Button } from "@material-ui/core";

class Check extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <Button 
                    onClick={this.props.newJob}>
                    Run analysis
                </Button>
            </div>
        );
    }
}

export default Check;












