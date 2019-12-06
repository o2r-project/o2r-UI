import React, { Component } from "react";

import httpRequests from '../../helpers/httpRequests';
import { Card, CardHeader, CardContent, CardActions, Button, IconButton, Collapse, Grid, Paper } from '@material-ui/core';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import prepareQuery from  './/queryBuilder'



class Discovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ERC: [],
            expanded: null,
            erc: 0
        }

    }

    componentDidMount() { this.searchCompendia() }

    searchCompendia = () => {
        const self = this
        httpRequests.complexSearch(prepareQuery())
            .then(function (res) {
                console.log(res)
                const result= []
                for(var erc of res.body.hits.hits){
                    result.push(erc._source)
                }
                self.setState({ERC: result});
            })
            .catch(function (res) {
                console.log(res)
            })
    }


    goToErc = (erc) => {
        this.props.history.push({
            pathname: '/erc/' + erc.id,
            state: { data: erc.metadata.o2r }
        });
    }

    setExpand = (index) => {
        let expand = index;
        if (this.state.expanded === index) { expand = null }
        this.setState({ expanded: expand })
    }

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={8} >
                        <Paper>Search</Paper>
                    </Grid>
                    <Grid item xs={4}>
                        {this.state.ERC.length > 0 ?
                            <Paper style={{ "max-height": "80vh", "overflow": "auto" }}>
                                {this.state.ERC.map((erc, index) => (
                                    <div>
                                        <Card style={{ "text-align": "justify", "margin": "10px" }}>
                                            {erc.substituted ? <CardHeader title={erc.metadata.o2r.title + " [SUBSTITUTED]"} style={{ "padding-bottom": "0px" }} /> :
                                                <CardHeader title={erc.metadata.o2r.title} style={{ "padding-bottom": "0px" }} />}
                                            <CardContent>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={9} style={{ "padding-top": "0px" }}>
                                                        <p> <span style={{ "font-weight": "bold" }}> Created on: </span> {erc.created.substr(0, 10)} {erc.created.substr(11, 5)}  <br />
                                                            <span style={{ "font-weight": "bold" }}> by: </span> {erc.user} </p>
                                                        {erc.metadata.o2r.description ?
                                                            <> {erc.metadata.o2r.description.substr(0, 300)}
                                                                <Collapse component={"span"} in={this.state.expanded === index} unmountOnExit>
                                                                    <span>{erc.metadata.o2r.description.substring(300, erc.metadata.o2r.description.length)}</span>
                                                                </Collapse>
                                                                {erc.metadata.o2r.description.length > 300 ?
                                                                    <IconButton aria-label='more_horiz' style={{ "padding": "0px", "margin-left": "5px" }}
                                                                        onClick={() => this.setExpand(index)}>
                                                                        {this.state.expanded === index ? <ExpandLessIcon /> : <MoreHorizIcon />}
                                                                    </IconButton> : ""}  </> :
                                                            <div> <p>This ERC has no description</p> </div>}
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Button variant="contained" size="small" color="primary" style={{ "top": "40%" }} onClick={() => this.goToErc(erc)}>
                                                            Go to ERC
                                                         </Button>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))} </Paper> : ""}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Discovery;