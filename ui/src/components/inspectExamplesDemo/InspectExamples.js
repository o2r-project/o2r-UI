import React, { Component } from "react";
import { Card, CardContent, CardActionArea, CardActions, Typography, Button, CardHeader, Grid, makeStyles } from "@material-ui/core/";
import { withRouter } from 'react-router-dom';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import '../../../node_modules/react-modal-video/css/modal-video.min.css';
import ModalVideo from 'react-modal-video';

import './inspectExamples.css';
import httpRequests from '../../helpers/httpRequests';
import config from '../../helpers/config.json'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
}));

function SpacingGrid(props) {
    const [spacing] = React.useState(2);
    const classes = useStyles();

    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={spacing}>
                    {props.ercs.map((erc, index) =>
                        <div key={index} style={{ width: '20%', marginRight: '2%', marginTop: '1%', marginBottom: '3%' }}>
                            <Card className="example">
                                <CardActionArea id={"button"+index} onClick={() => props.forward(erc)}>
                                    <CardHeader
                                        title={erc.metadata.o2r.title} />
                                    <CardContent>
                                        <Typography component="p">
                                            {erc.metadata.o2r.description.substr(0, 150)}...
                                             </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Grid container>
                                        <TwitterShareButton url={config.ercUrl + erc.id} >
                                            <TwitterIcon
                                                size={32}
                                                round
                                            />
                                        </TwitterShareButton>
                                        <Button size="small" color="primary"
                                            onClick={() => props.forward(erc)}
                                        >
                                            Go to ERC
                                        </Button>
                                        <a className="link" href={config.ercUrl + erc.id}>{config.ercUrl + erc.id}</a>
                                    </Grid>
                                </CardActions>

                            </Card>
                        </div>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}

class InspectExamples extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ercs: [],
            isOpen: false,
        }
        this.getErcs = this.getErcs.bind(this);
        this.forward = this.forward.bind(this);
    }

    sort = (ercs) => { return ercs };

    getErcs() {
        let ercs = [];
        httpRequests.listAllCompendia()
            .then((res) => {
                res.data.results.forEach(ercId => {
                    httpRequests.singleCompendium(ercId)
                        .then((res2) => {
                            ercs.push(res2.data);
                            if (res.data.results.length === ercs.length) {
                                this.setState({
                                    ercs: ercs.sort(function (a, b) { return new Date(b.created) - new Date(a.created) }),
                                })
                            }
                        })
                        .catch((res2) => console.log(res2))
                });
            })
            .catch((res) => console.log(res))
    }

    componentDidMount = () => this.getErcs();

    forward = (erc) => {
        this.props.history.push({
            pathname: '/erc/' + erc.id,
            state: { data: erc.metadata }
        });
    }

    openModal = () => this.setState({ isOpen: true });

    render() {
        console.log(this.state)
        return (
            <div>
                <h1 style={{ textAlign: 'center', marginBottom: '2%', marginTop: '5%' }}>
                    Examine Executable Research Compendia
                    <Button
                        onClick={this.openModal.bind(this)}
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: '5%' }}
                    >
                        Show me what I can do
                    </Button>
                </h1>
                <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId='e37bzH4cXF4' onClose={() => this.setState({ isOpen: false })}
                    style={{ width: '10%' }}
                />
                <SpacingGrid
                    ercs={this.state.ercs}
                    forward={this.forward}
                />
            </div>
        )
    }
}

export default withRouter(InspectExamples);
