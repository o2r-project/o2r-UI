import React, { Component } from "react";
import { Button, Dialog, AppBar, Toolbar, Slide, Tabs, Tab } from "@material-ui/core";
import ReactCompareImage from 'react-compare-image';
//import VisualDiff from 'react-visual-diff'; Interesting for later when bindings are used for numbers in the text

import './figureComparison.css'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ComparisonView(props) {
    const [open, setOpen] = React.useState(false);
    const [tabValue, setTab] = React.useState(0);

    const handleClickOpen = () => {
      setOpen(true);
    }
  
    const handleClose = () => {
      setOpen(false);
    }

    const handleTabChange = (evt, newValue) => {
        setTab(newValue);
    }
  
    return (
        <div>
            <Button variant="contained" color="primary" className="maniBtn"
                onClick={handleClickOpen}
                style={{marginTop: "1%"}}
                disabled={props.settings.length!==2}
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
                <div>
                    <Tabs indicatorColor="primary" textColor="primary" className="comparisonTabs"
                    onChange={handleTabChange}
                    value={tabValue}
                    >
                        <Tab label="Side-by-Side" />
                        <Tab label="Overlay" />
                    </Tabs>
                    {tabValue === 0 &&
                        props.settings.map((setting,index) => (
                            <figure className="img">
                                <figcaption>{props.settingsText[index]}</figcaption>
                                <img src={setting} alt=""/>
                            </figure>
                        ))}
                    {tabValue === 1 &&
                        <div className="overlay">
                            <ReactCompareImage leftImage={props.settings[0]} rightImage={props.settings[1]} />
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
            <ComparisonView settings={this.props.settings} settingsText={this.props.settingsText}/>
        );
    }
}

export default FigureComparison;