import React, { Component } from 'react';
import { Tabs, Tab, Typography, AppBar, LinearProgress } from '@material-ui/core';

import './createERC.css';
import RequiredMetadata from './requiredMetadata/RequiredMetadata';
//import SpatioTemporalMetadata from './spatioTemporalMetadata/SpatioTemporalMetadata';
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
            value: 0,
            metadata: null,
            compendium_id: props.match.params.id,
            codefile: null,
            showProgress: false,
        }
    }

    handleTabChange = ( e, val ) => this.setState({value: val,});

    getMetadata() {
        const self = this;
        httpRequests.singleCompendium(self.state.compendium_id)
        .then( ( res ) => {
            const metadata = res.data.metadata.o2r;
                httpRequests.getFile("compendium/" + self.state.compendium_id + "/data/" + metadata.mainfile)
                .then(function (res2) {
                    self.setState({
                        metadata: metadata,
                        codefile: res2,
                    });
                })
                .catch((res2) => console.log(res2))
        })
        .catch((res) => console.log(res))
    }

    updateMetadata = (metadata, forward) => {
        this.setState({showProgress:true});
        const self = this;
        httpRequests.updateMetadata(self.state.compendium_id, metadata)
        .then( ( res2 ) => {
            this.setState({showProgress:false});
            if (forward) {
                self.goToErc();
            }
        })
        .catch((res2) => {
            this.setState({showProgress:false});
        })
    }

    goToErc = () => {
        this.props.history.push({
            pathname: '/erc/' + this.state.compendium_id,
            state: { data: this.metadata }
        });
    }
    
    componentDidMount = () => this.getMetadata();

    render() {
        const { value } = this.state;
        console.log(this.state)
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
                ?<LinearProgress className="progress"/>
                :''}
                {value === 0 &&
                    <TabContainer>
                        {this.state.metadata != null 
                        ?<RequiredMetadata
                            metadata={this.state.metadata}
                            updateMetadata={this.updateMetadata}
                            goToErc={this.goToErc}
                        />
                        : ''}
                    </TabContainer>
                }
                {value === 1 &&
                    <TabContainer>
                        
                    </TabContainer>
                }
                {value === 2 &&
                    <TabContainer>
                        <Bindings
                            metadata={this.state.metadata}
                            codefile={this.state.codefile}
                            compendium_id={this.state.compendium_id}
                            updateMetadata={this.updateMetadata}
                            goToErc={this.goToErc}
                        />
                    </TabContainer>
                }
            </div>
        );
    }
}

export default CreateERC;