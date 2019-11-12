import React from 'react';

import httpRequests from '../../../helpers/httpRequests';
import { Card, CardHeader, CardContent, CardActions, Button, IconButton, Collapse } from '@material-ui/core';
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

    componentDidMount() {
        var self = this;
        httpRequests.getUser()
            .then(function (res) {
                self.getUserCompendia(res.data.orcid)
            })
            .catch(function (res) {
                console.log(res)
            })
    }

    getUserCompendia = (orcid) => {
        const self = this
        httpRequests.listUserCompendia(orcid)
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
                            <br />
                            <Card style={{ "text-align": "left", "display": "inline-block" }}>
                                <CardHeader title={erc.metadata.o2r.title} />
                                <CardContent>
                                    {erc.metadata.o2r.description.substr(0, 300)}
                                    <Collapse component={"span"} in={this.state.expanded === index} unmountOnExit>
                                        <span>{erc.metadata.o2r.description.substring(300, erc.metadata.o2r.description.length)}</span>
                                    </Collapse>
                                    <IconButton aria-label='more_horiz' style={{ "padding": "0px", "margin-left": "5px" }}
                                        onClick={() => this.setExpand(index)}>
                                        {this.state.expanded === index ? <ExpandLessIcon /> : <MoreHorizIcon />}
                                    </IconButton>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={() => this.setErc(erc)}>
                                            Substitute
                                         </Button>
                                    </CardActions>
                                </CardContent>
                            </Card>
                        </div>
                    )) : ""}
                    <Substitute erc={this.state.erc} setErc={this.setErc}/>
            </div>
        )
    }
}

export default Substitution;
