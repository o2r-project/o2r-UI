import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';

class Popup extends React.Component {

render() {
    return (
        <div>
            <Dialog
                open={this.props.open}
                onClose={this.props.handlePopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Codelines in Bindings found</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.selectedText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary"
                        onClick={this.props.closePopup} 
                    >
                        OK
                    </Button>
                    <Button color="primary" autoFocus
                        //onClick={this.handleClose.bind(this, "tabChange")} 
                    >
                        Go to Manipulate
                   </Button>
                </DialogActions>
            </Dialog>
        </div>
    )}
}

export default Popup;