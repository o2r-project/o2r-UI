import React, { Component } from "react";

import httpRequests from '../../helpers/httpRequests';
import { Card, CardHeader, CardContent, CardActions, Button, IconButton, Collapse, Grid, Paper, TextField } from '@material-ui/core';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import prepareQuery from './/queryBuilder'

import ResultList from './resultList'


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

    searchCompendia = (term, from, to, coordinates, libaries) => {
        const self = this
        httpRequests.complexSearch(prepareQuery(term, coordinates, from, to, null, null, libaries))
            .then(function (res) {
                console.log(res)
                const result = []
                for (var erc of res.data.hits.hits) {
                    result.push(erc._source)
                }
                self.setState({ ERC: result });
            })
            .catch(function (res) {
                console.log(res)
            })
    }

    handleChange = async (e, name) => {
        await this.setState({
          [name]: e.target.value
        })
        this.searchCompendia(this.state.keyword, this.state.from, this.state.coordinates, this.state.libaries)
      }


    goToErc = (erc) => {
        this.props.history.push({
            pathname: '/erc/' + erc.compendium_id,
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
                <Grid container spacing={3}>
                    <Grid item xs={8} >
                        <Paper>
                            <TextField
                                type="search"
                                label="Keyword Search"
                                fullWidth
                                value={this.state.keyword}
                                onChange={(e) => this.handleChange(e, "keyword")}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        {this.state.ERC.length > 0 ?
                        <>
                        <h4>Results: </h4>
                        <ResultList ercs={this.state.ERC} goToErc={this.goToErc}></ResultList> 
                        </>: ""}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Discovery;