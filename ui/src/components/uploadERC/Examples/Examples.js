import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

import './examples.css';
import ercs from './ercs.json';

function exampleERCs(props, close){
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