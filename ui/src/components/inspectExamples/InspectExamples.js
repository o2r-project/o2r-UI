import React, { Component } from "react";
import { Card, CardContent, CardActionArea, CardActions, CardMedia, Typography, Button, CardHeader } from "@material-ui/core/";
import { withStyles } from '@material-ui/core/styles';

import './inspectExamples.css';
import ercs from '../../helpers/ercs.json';
import pic from '../../assets/img/image.png';

const styles = {
    card: {
      maxWidth: 345,
    },
    media: {
      width: 200,
    },
  };

function exampleERCs(props){
    const { classes } = props;
    const ercItems = ercs.map((erc) => {
        return (
            <div key={erc.id}>
                <Card id="example">
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
                    {exampleERCs(this.props)}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(InspectExamples);