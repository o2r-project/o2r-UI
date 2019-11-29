import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, List, ListItem, ListItemText } from "@material-ui/core";


class SubstitutionInfoPop extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        this.handleClose = this.handleClose.bind(this)
    }

    handleClose() {
        this.props.handleClose();
    }

    goToErc = (id) => {
        this.handleClose();
        this.props.history.push({
            pathname: '/erc/' + id,
        });
        window.location.reload(true);
    }

    render() {console.log(this.props.substitution)

        return (
            <div>
                <Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{ "align-self": "center" }} id="form-dialog-title">Substitution Info</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Substitution is the combination of an base compendium, "base" for short, and an overlay compendium, or "overlay". 
                        A user can choose files from the overlay to replace files of the base.

                        Substituted Files:
                        </DialogContentText>
                        <List>
                            {this.props.substitution.substitutionFiles.map((item) => (
                                <>
                                    <ListItem>
                                        <ListItemText primary={"The base File \""+ item.base + "\" was substituted by the overlay File \"" +item.overlay + '"'}/>
                                    </ListItem>
                              </>
                            )) }
                        </List>
                    </DialogContent>          
                    <DialogActions>
                    <Button onClick={() => this.goToErc(this.props.substitution.base)} color="primary">
                            Check out base ERC
                        </Button>
                    <Button onClick={() => this.goToErc(this.props.substitution.overlay)} color="primary">
                            Check out overlay ERC
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}


export default withRouter(SubstitutionInfoPop);