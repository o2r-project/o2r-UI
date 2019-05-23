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
            <Card key={author} id="authorcard">
                <CardContent>
                    <p>Max Power</p>
                    <p>Institute for Geoinformatics</p>
                    <p>0000 000 000 1</p>
                </CardContent>
            </Card>
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
                    <h4>Authors</h4>
                    <CardContent>
                        <Title></Title>
                    </CardContent>
                    <h4>Title</h4>
                    <Authors 
                        authors={this.props}>
                    </Authors>
                    <TextField
                        id="date"
                        label="Publication date"
                        type="date"
                        //defaultValue="2017-05-24"
                        //className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </Card>
            </div>
        );
    }
}

export default RequiredMetadata;