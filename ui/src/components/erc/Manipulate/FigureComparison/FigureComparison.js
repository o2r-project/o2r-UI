import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide } from "@material-ui/core";

import './figureComparison.css'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ComparisonView(props) {
    const [open, setOpen] = React.useState(false);

    function handleClickOpen() {
      setOpen(true);
    }
  
    function handleClose() {
      setOpen(false);
    }
  
    return (
        <div>
            <Button variant="contained" color="primary" 
                onClick={handleClickOpen}
                style={{marginTop: "5%"}}
            >
                Show comparison
            </Button>
            <Dialog fullScreen TransitionComponent={Transition}
                open={open} 
                onClose={handleClose}
            >
                <AppBar>
                    <Toolbar>
                        <Button color="inherit" onClick={handleClose}>Close</Button>
                    </Toolbar>
                </AppBar>
                    <div className="compare">
                        test
                    </div>
            </Dialog>
        </div>
    );
  }

class FigureComparison extends Component {

    render() {
        return (
            <ComparisonView />
        );
    }
}

export default FigureComparison;