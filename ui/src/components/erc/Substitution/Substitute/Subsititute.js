import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Substitute extends Component {

    constructor(props) {
        super(props);
    }

    handleClose = () => {
        this.props.setErc(0);
    }

    render() {


        return (
            <div>
                <Dialog className="main_block" fullScreen TransitionComponent={Transition}
                    open={this.props.erc !== 0}
                >
                    <AppBar>
                        <Toolbar>
                            <Button color="inherit" onClick={() => this.handleClose()}>Close</Button>
                        </Toolbar>
                    </AppBar>

                </Dialog>
            </div>
        )
    }
}


export default Substitute;