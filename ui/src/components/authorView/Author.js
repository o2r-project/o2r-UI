import React, { Component } from "react";

import httpRequests from '../../helpers/httpRequests';
import ResultList from './resultList'
import { Grid, Paper } from "@material-ui/core";

class Author extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: props.match.params.id,
            publishedERCs: [],
            ERCs: [],
        }
    }
    componentDidMount() {
        this.getCompendia();
        document.title = "Author View" + config.title; // eslint-disable-line
    }

    goToErc = (erc) => {
        this.props.history.push({
            pathname: '/erc/' + erc.id,
            state: { data: erc.metadata.o2r }
        });
    }

    editMetadata = (erc) => {
        this.props.history.push({
            pathname: '/createErc/' + erc.id,
            state: { data: erc.metadata.o2r }
        });
    }

    getCompendia = () => {
        const self = this
        httpRequests.listUserCompendia(self.state.user_id)
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
                        self.setState({ publishedERCs: ERCs })
                })
                .catch(function (res) {
                    console.log(res)
                })
        }
    }


    render() {
        return (
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <p style={{textAlign: "center"}}> published ERCs:</p>
                        <Paper style={{ minHeight: "80vh", maxHeight: "80vh", "overflow": "auto" }}>
                            <ResultList ercs= {this.state.publishedERCs} goToErc={this.goToErc} editMetadata={this.editMetadata}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <p style={{textAlign: "center"}}>candidates with public link:</p>
                        <Paper style={{ minHeight: "80vh", maxHeight: "80vh", "overflow": "auto" }}>
                            <ResultList ercs= {this.state.ERCs} goToErc={this.goToErc} editMetadata={this.editMetadata}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <p style={{textAlign: "center"}} >candidates</p>
                        <Paper style={{ minHeight: "80vh", maxHeight: "80vh", "overflow": "auto" }}>
                            <ResultList ercs= {this.state.ERCs} goToErc={this.goToErc} editMetadata={this.editMetadata}/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Author;
