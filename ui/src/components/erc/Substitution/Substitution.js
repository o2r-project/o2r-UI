import React from 'react';

import httpRequests from '../../../helpers/httpRequests';
import { Card, CardHeader, CardContent, CardActions, Button, IconButton, Collapse, Grid } from '@material-ui/core';
import Substitute from './Substitute/Subsititute'

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import './substitution.css'

class Substitution extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ERC: [],
            expanded: null,
            erc: 0
        }

    }

    componentDidMount() {this.getCompendia()}

    getCompendia = () => {
        const self = this
        httpRequests.listAllCompendia()
            .then(function (res) {
                self.getCompenidaContent(res.data.results)
            })
            .catch(function (res) {
                console.log(res)
            })
    }


    getCompenidaContent = (compenidaList) => {
        const self = this;
        const ERCs = []
        for (var compendia of compenidaList) {
            httpRequests.singleCompendium(compendia)
                .then(function (res) {
                    ERCs.push(res.data)
                    self.setState({ ERC: ERCs })
                })
                .catch(function (res) {
                    console.log(res)
                })
        }

    }

    setExpand = (index) => {
        let expand = index;
        if (this.state.expanded === index) { expand = null }
        this.setState({ expanded: expand })
    }

    setErc = (erc) => {
        this.setState({ erc })
    }


    render() {
        return (
            <div>
                {this.state.ERC.length > 0 ?
                    this.state.ERC.map((erc, index) => (
                        <div>
                            <Card style={{ "text-align": "justify", "margin": "10px" }}>
                                <CardHeader title={erc.metadata.o2r.title} style={{"padding-bottom" : "0px"}} />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs={10} style={{"padding-top" : "0px"}}>
                                        <p> <span  style={{"font-weight" : "bold"}}> Created on: </span> {erc.created.substr(0,10)} {erc.created.substr(11,5)}  <br/>
                                        <span  style={{"font-weight" : "bold"}}> by: </span> {erc.user} </p>
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
                                        <Grid item xs={2}>
                                            <Button variant="contained" size="small" color="primary" style={{"top":"40%"}} onClick={() => this.setErc(erc)}>
                                                Substitute
                                             </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </div>
                    )) : ""}
                    {this.state.erc !== 0 ? <Substitute baseErc={this.props.baseErcMetadata} baseErcId ={this.props.baseErcId} erc={this.state.erc.metadata.o2r} ercId={this.state.erc.id} setErc={this.setErc}/> : ""}
            </div>
        )
    }
}

export default Substitution;
