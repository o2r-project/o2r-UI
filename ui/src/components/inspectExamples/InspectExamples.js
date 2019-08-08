import React, { Component } from "react";
import { Card, CardContent, CardActionArea, CardActions, Typography, Button, CardHeader } from "@material-ui/core/";
import { withRouter } from 'react-router-dom';
import {TwitterShareButton, TwitterIcon} from 'react-share';

import './inspectExamples.css';
import httpRequests from '../../helpers/httpRequests';

class InspectExamples extends Component {

    constructor(props) {
        super(props);
        this.state={
            ercs: []
        }
        this.getERcs = this.getERcs.bind(this);
    }

    sort ( ercs ) {
        return ercs;
    }

    getERcs () {
        let ercs = [];
        httpRequests.listAllCompendia()
        .then ( ( res ) => {
            res.data.results.forEach( ercId => {
                httpRequests.singleCompendium(ercId)
                .then ( ( res2 ) => {
                    ercs.push(res2.data);
                    if ( res.data.results.length === ercs.length) {
                        this.setState({
                            ercs: ercs.sort(function(a,b) {return new Date(b.created) - new Date(a.created)}),
                        })
                    }
                })
                .catch ( ( res2 ) => {
                    console.log(res2)
                })
            });
        })
        .catch ( ( res ) => {
            console.log(res);
        })
    }

    componentDidMount () {
        this.getERcs();
    }

    forward = (erc) => {
        this.props.history.push({
            pathname: '/erc/' + erc.id, 
            state: {data:erc.metadata}
        });
    }
 
    render() {
        console.log(this.state)
        return(
            <div>
                <h1>Latest ERCs</h1>
                {this.state.ercs.map( (erc, index ) =>
                    <div key={index}>
                        <Card className="example">
                            <CardActionArea onClick={this.forward.bind(this,erc)}>
                                <CardHeader
                                        title={erc.metadata.o2r.title}/>
                                    <CardContent>
                                    <Typography component="p">
                                        {erc.metadata.o2r.description.substr(0,150)}...
                                    </Typography>
                                    </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <TwitterShareButton url={"http://localhost/#/erc/" + erc.id} >
                                    <TwitterIcon
                                        size={32}
                                        round 
                                    />
                                </TwitterShareButton>
                                <Button size="small" color="primary"
                                    onClick={this.forward.bind(this,erc)}
                                >
                                Go to ERC
                                </Button>
                            </CardActions>               
                        </Card> 
                    </div>
                )}
            </div>
        )
    }
}

export default withRouter(InspectExamples);