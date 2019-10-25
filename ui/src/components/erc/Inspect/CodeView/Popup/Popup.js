import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';

class Popup extends React.Component {

render() {
    return (
        <div>
            <Dialog
                open={this.props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.selectedText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary"
                        onClick={this.props.closePopup.bind(this, "code")} 
                    >
                        OK
                    </Button>
                    <Button color="primary" autoFocus
                        onClick={this.props.closePopup.bind(this, "tabChange")} 
                    >
                        Go to Manipulate
                   </Button>
                </DialogActions>
            </Dialog>
        </div>
    )}
}

export default Popup;