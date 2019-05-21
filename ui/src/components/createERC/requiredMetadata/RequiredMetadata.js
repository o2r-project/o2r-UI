import React, { Component } from 'react';
import { Card, CardContent, TextField } from "@material-ui/core";

import './requiredMetadata.css';

function Title() {
    return (                    
    <TextField
        id="title"
        label="Required"
        style={{ margin: 8 }}
        placeholder="Title"
        fullWidth
        required
        margin="normal"
        variant="outlined"
        InputLabelProps={{
            shrink: true,
    }}/>)
}

function Authors(props) {
    const listItems = props.authors.authors.map((author) => {
        return (
            <li key={author}>
                {author}
            </li>
        );
    });
    return listItems;
}

class RequiredMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metadata: props,
        }
    };

    render() {
        return (
            <div>
                <Card>
                    <CardContent>
                        <Title></Title>
                    </CardContent>
                    <Authors 
                        authors={this.props}>
                    </Authors>
                </Card>
            </div>
        );
    }
}

export default RequiredMetadata;