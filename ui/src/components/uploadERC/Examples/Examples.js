import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

import './examples.css';

function exampleERCs(props, close){
    const ercs = [{
        name: "R Markdown",
        url: "https://uni-muenster.sciebo.de/s/hAh8AZLYvHNgNA9",
        folder: "/workspace-rmd-data"
    },{
        name: "R Markdown (different data)",
        url: "https://uni-muenster.sciebo.de/s/hAh8AZLYvHNgNA9",
        folder: "/workspace-rmd-data-other"
    },{
        name: "R Markdown (random plot)",
        url: "https://uni-muenster.sciebo.de/s/hAh8AZLYvHNgNA9",
        folder: "/workspace-rmd-data-random"
    },{
        name: "A question driven socio-hydrological modeling process",
        url: "https://uni-muenster.sciebo.de/s/hAh8AZLYvHNgNA9",
        folder: "/corpus_aquestiondrivenprocess",
        doi: "https://doi.org/10.5194/hess-20-73-2016"
    },{
        name: "spacetime: Spatio-Temporal Data in R",
        url: "https://uni-muenster.sciebo.de/s/hAh8AZLYvHNgNA9",
        folder: "/corpus_spacetime.zip",
        doi: "http://dx.doi.org/10.18637/jss.v051.i07"
    }];
    
    const ercItems = ercs.map((erc) => {
        return (
            <div> 
                <Button onClick={() => close(erc.url, erc.folder)}>{erc.name}</Button>
                <a href={erc.doi}>{erc.doi ? 'Original':''}</a>
            </div>
        );
    });
    return ercItems;
}

class Examples extends Component {
    constructor(props){
        super(props);
        this.state={
            open:false,
        };
    }
    
    handleClickOpen = () => {
        this.setState({
            open:true
        });
    };

    handleClose = (url, folder) => {
        this.props.onClick(url, folder);
        this.setState({
            open: false
        });
    }

    render() {
        return (
            <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen} id="examplesButton">
              Load examples
            </Button>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">{"Select an example from the list"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {exampleERCs(this.props, this.handleClose)}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
    }
}

export default Examples;