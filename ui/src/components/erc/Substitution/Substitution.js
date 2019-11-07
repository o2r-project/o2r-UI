import React from 'react';

import httpRequests from '../../../helpers/httpRequests';
import { Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';

class Substitution extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ERC: []
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


    render() {
        return (
            <div>
                {this.state.ERC.length > 0 ?
                    this.state.ERC.map((erc) => (
                        <div>
                            <br />
                            <Card>
                                <CardHeader title={erc.metadata.o2r.title} />
                                <CardContent>
                                    <p style={{ "textAlign": "left" }}>{erc.metadata.o2r.description}</p>
                                    <CardActions>
                                        <Button size="small" color="primary">
                                            Substitute
                                 </Button>
                                    </CardActions>
                                </CardContent>
                            </Card>
                        </div>
                    )) : ""}
            </div>
        )
    }
}

export default Substitution;
