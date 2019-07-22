import React, { Component } from "react";
import { Card, CardContent, CardActionArea, CardActions, Typography, Button, CardHeader } from "@material-ui/core/";

import './inspectExamples.css';
import ercs from '../../helpers/ercs.json';

function exampleERCs(){
    const ercItems = ercs.map((erc) => {
        return (
            <div key={erc.id}>
                <Card className="example">
                    <CardActionArea>
                    <CardHeader
                            title={erc.name}/>
                        <CardContent>
                        <Typography component="p">
                            Text
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                        Share
                        </Button>
                        <Button size="small" color="primary">
                        Go to ERC
                        </Button>
                    </CardActions>               
                </Card> 
            </div>
        );
    });
    return ercItems;
}

class InspectExamples extends Component {

    render() {
        return(
            <div>
                <h1>Latest ERCs</h1>
                <div> 
                    {exampleERCs()}
                </div>
            </div>
        )
    }
}

export default InspectExamples;