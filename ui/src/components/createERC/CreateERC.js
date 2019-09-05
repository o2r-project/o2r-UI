import React, { Component } from 'react';
import { Tabs, Tab, Typography, AppBar, Snackbar, LinearProgress } from '@material-ui/core';


import './createERC.css';
import RequiredMetadata from './requiredMetadata/RequiredMetadata';
import SpatioTemporalMetadata from './spatioTemporalMetadata/SpatioTemporalMetadata';
import Bindings from './bindings/Bindings';
import httpRequests from '../../helpers/httpRequests';



function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

class CreateERC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authors: [],
            value: 0,
            metadata: null,
            originalMetadata: null,
            compendium_id: props.match.params.id,
            codefile: null,
            message: "",
            open: false,
            changed: false,
            authorsChanged: false,
            spatioTemporalChanged: false,
            authorsValid: false,
        }
    }


    handleTabChange = (e, val) => this.setState({ value: val, });

    getMetadata() {

        const self = this;
        httpRequests.singleCompendium(self.state.compendium_id)
            .then(function (res) {
                const metadata = res.data.metadata.o2r;
                httpRequests.getFile("compendium/" + self.state.compendium_id + "/data/" + metadata.mainfile)
                    .then(function (res2) {
                        self.setState({
                            metadata: metadata,
                            originalMetadata: JSON.parse(JSON.stringify(metadata)),
                            authors: metadata.creators,
                            codefile: res2,
                        }, () => self.authorsNotNull());
                    })
            })
            .catch(function (res2) {
                console.log(res2);
            })

    }

    setMetadata = (metadata, submit) => {

        this.setState({
            metadata: metadata,
        }, () => {
            if (submit) {
                this.updateMetadata()
            }
        });
    }

    updateMetadata = (metadata, forward) => {
        this.setState({ showProgress: true });
        const self = this;
        this.setState({
            authorsChanged: false,
            changed: false,
            open: true,
            message: "Updating Metadata",
            backgroundColor: "blue",
            originalMetadata: JSON.parse(JSON.stringify(this.state.metadata)),
        })
        httpRequests.updateMetadata(self.state.compendium_id, self.state.metadata)
            .then(function (res2) {
                self.setState({ showProgress: false, saved: true, open: true, message: "Metadata updated", backgroundColor: "green" })
            })
            .catch(function (res2) {
                self.setState({ showProgress: false, saved: true, open: true, message: "Metadata update failed", backgroundColor: "red" })
                console.log(res2)
            })
    }

    goToErc = () => {
        this.props.history.push({
            pathname: '/erc/' + this.state.compendium_id,
            state: { data: this.metadata }
        });
    }

    updateAuthors = async (value) => {

        var changed = true;
        if (JSON.stringify(value) === JSON.stringify(this.state.originalMetadata.creators)) {
            changed = false;
        }


        this.setState({ authors: value, authorsChanged: changed }, () => {
            this.authorsNotNull()
        })
    }

    setChangedFalse = (x) => {
        if (x == "all") {
            this.setState({ changed: false, authorsChanged: false })
        }
        else {
            this.setState({ [x]: false })
        }
    }

    setChanged = (changed) => {
        this.setState({ [changed]: true })
    }

    authorsNotNull = () => {

        let valid = true;
        if (this.state.authors.length === 0 || this.state.authors === null) {
            valid = false;
        }
        for (var i in this.state.authors) {
            if (this.state.authors[i].name === "" || this.state.authors[i].name === null) {
                valid = false;
            }
        }
        this.setState({ authorsValid: valid });
    };


    componentDidMount = () => this.getMetadata();

    handleClose = () => {
        this.setState({ open: false })
    }

    render() {
        const { value } = this.state;
        return (
            <div>
                <AppBar position="fixed" color="default" id="appBar">
                    <Tabs scrollButtons="on" variant="standard" indicatorColor="primary" centered textColor="primary"
                        value={value}
                        onChange={this.handleTabChange}
                    >
                        <Tab label="Required Metadata" />
                        <Tab label="Spatiotemporal Metadata" />
                        <Tab label="Create bindings" />
                    </Tabs>
                </AppBar>
                {this.state.showProgress
                    ? <LinearProgress className="progress" />
                    : ''}
                {value === 0 &&
                    <TabContainer>
                        {this.state.metadata != null
                            ? <RequiredMetadata
                                metadata={this.state.metadata}
                                setMetadata={this.setMetadata}
                                goToErc={this.goToErc}
                                originalMetadata={this.state.originalMetadata}
                                authors={this.state.authors}
                                authorsChanged={this.state.authorsChanged}
                                changed={this.state.changed}
                                spatioTemporalChanged={this.state.spatioTemporalChanged}
                                updateAuthors={this.updateAuthors}
                                setChangedFalse={this.setChangedFalse}
                                setChanged={this.setChanged}
                                authorsValid={this.state.authorsValid}
                            />
                            : ''}
                    </TabContainer>
                }
                {value === 1 &&
                    <TabContainer>
                        { <SpatioTemporalMetadata
                            goToErc={this.goToErc}
                            metadata={this.state.metadata}
                            setMetadata={this.setMetadata}
                            originalMetadata={this.state.originalMetadata}
                            setChanged={this.setChanged}
                            setChangedFalse={this.setChangedFalse}
                            changed={this.state.changed}
                            authorsChanged={this.state.authorsChanged}
                            spatioTemporalChanged={this.state.spatioTemporalChanged}/> }
                    </TabContainer>
                }
                {value === 2 &&
                    <TabContainer>
                        <Bindings
                            metadata={this.state.metadata}
                            codefile={this.state.codefile}
                            compendium_id={this.state.compendium_id}
                            updateMetadata={this.updateMetadata}
                            originalMetadata={this.state.originalMetadata}
                            goToERC={this.goToErc}
                        />
                    </TabContainer>
                }
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    onClose={this.handleClose}
                    autoHideDuration={6000}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                        'style': { backgroundColor: this.state.backgroundColor }
                    }}
                    message={<span id="message-id"> {this.state.message} </span>}
                />
            </div>



        );
    }
}

export default CreateERC;