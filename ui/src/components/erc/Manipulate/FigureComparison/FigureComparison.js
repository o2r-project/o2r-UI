import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, Tabs, Tab, Grid, Typography } from "@material-ui/core";
import logo from '../../../../assets/img/o2r-logo-only-white.svg';
import ReactCompareImage from 'react-compare-image';
import ImageDiff from "..//..//..//..//helpers/react-image-diff.js";
import { withRouter } from 'react-router-dom';
//import VisualDiff from 'react-visual-diff'; Interesting for later when bindings are used for numbers in the text

import './figureComparison.css'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ComparisonView(props) {
    const [open, setOpen] = React.useState(false);
    const [tabValue, setTab] = React.useState(0);

    React.useEffect(() => {
    if (props.location.search === '?compare') {
        setOpen(true)
    }
    else{
        setOpen(false)
    }

}, [props.location.search]);

    const handleClickOpen = () => {
        props.history.push(props.location.pathname + '?compare')
    }

    const handleClose = () => {
        window.history.back();
    }

    const handleTabChange = (evt, newValue) => {
        setTab(newValue);
    }

    return (
        <div>
            <Button variant="contained" color="primary" className="maniBtn"
                onClick={handleClickOpen}
                style={{ marginTop: "1%" }}
                disabled={props.settings.length !== 2}
            >
                Show comparison
            </Button>
            <Dialog fullScreen TransitionComponent={Transition}
                open={open}
                onClose={handleClose}
            >
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
                            <a href="/"><img src={logo} alt="o2r" id="headerLogo" /></a>
                        </Typography>
                        <Button color="inherit" onClick={handleClose}>Close</Button>
                    </Toolbar>
                </AppBar>
                <div>
                    <Tabs indicatorColor="primary" textColor="primary" className="comparisonTabs"
                        onChange={handleTabChange}
                        value={tabValue}
                        centered
                    >
                        <Tab label="Side-by-Side" />
                        <Tab label="Overlay" />
                        <Tab label="Differences" />
                    </Tabs>
                    {tabValue === 0 &&
                        <Grid container spacing={3} >
                            {props.settings.map((setting, index) => (
                                <Grid item xs={6} style={{ "text-align": "center" }}>
                                    <figure className="img">
                                        <figcaption>{props.settingsText[index]}</figcaption>
                                        <img src={setting} alt="" />
                                    </figure>

                                </Grid>
                            ))}
                        </Grid>}
                    {tabValue === 1 &&
                        <div className="overlay">
                            <Grid container justify="center" alignItems="center" spacing={3} >
                                <Grid item xs={3} style={{ "text-align": "center" }}>
                                    {props.settingsText[0]}
                                </Grid>
                                <Grid item xs={6} style={{ "text-align": "center" }}>
                                    <ReactCompareImage leftImage={props.settings[0]} rightImage={props.settings[1]} />
                                </Grid>
                                <Grid item xs={3} style={{ "text-align": "center" }}>
                                    {props.settingsText[1]}
                                </Grid>
                            </Grid>

                        </div>
                    }
                    {tabValue === 2 &&
                        <div className="differences">
                            <p> Differences </p>
                            {<ImageDiff before={props.settings[0]} after={props.settings[1]} type="difference" value={.5} />
                            }
                        </div>
                    }
                </div>
            </Dialog>
        </div>
    );
}

class FigureComparison extends Component {

    render() {
        return (
            <ComparisonView settings={this.props.settings} settingsText={this.props.settingsText}  location={this.props.location} history={this.props.history} />
        );
    }
}

export default withRouter(FigureComparison);