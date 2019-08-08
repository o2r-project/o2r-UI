import React from 'react';
import Highlight from 'react-highlight.js';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import httpRequests from '../../../../helpers/httpRequests';
import './codeview.css'


class CodeView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            answerText: "",
            open: false
        }
    }

    handleClose(name, e) {
        console.log(e);
        if(name=="tabChange")
        {
            console.log(true)
            this.props.handleTabChange(e, 2);
        }
        this.setState({ open: false })
    }

    handleMouseUp(e) {
        var self = this;
        var answerText = "";
        var term = window.getSelection().getRangeAt(0).toString();
        var figures = []

        for (var i in this.props.metadata.interaction) {
            for (var j in this.props.metadata.interaction[i].sourcecode.parameter) {
                if (term.indexOf(this.props.metadata.interaction[i].sourcecode.parameter[j].text) != -1) {
                    var parameter = false;
                    for (var j in figures) {
                        if (this.props.metadata.interaction[i].computationalResult.result === figures[i]) {
                            parameter = true;
                        }
                    }
                    if (!parameter) {
                        figures.push(this.props.metadata.interaction[i].computationalResult.result)
                    }


                }
            }

        }

        if (figures.length != 0) {
            answerText = "This Codeline is the Parameter for "

            for (var i = 0; i < figures.length - 1; i++) {
                answerText += figures[i] + " and ";
            }
            answerText += figures[figures.length - 1] + ". "
        }

        try {
            httpRequests.searchBinding(term, this.props.metadata)
                .then(function (res) {
                    console.log(res)


                    if (res.data.data.length != 0) {
                        for (var i in res.data.data) {
                            for (var j in figures) {
                                if (res.data.data[i] == figures[j]) {
                                    console.log(true)
                                    res.data.data.splice(i, 1)
                                }
                            }
                        }
                        console.log(res.data.data)
                        if (res.data.data[i] == figures[j]) {
                            parameter = true;
                        }
                    
                    for (var i = 0; i < res.data.data.length - 1; i++) {
                        answerText += res.data.data[i] + " and "
                    }
                    answerText += res.data.data[res.data.data.length - 1] + " using this Codeline. Please check in the \"Manipulate\" view"

                }
                if(figures.length != 0 || res.data.data.length != 0)
                {
                    self.setState({answerText: answerText, open: true})
                }

        })
                .catch (function (res) {
            console.log(res);
        })
    } catch(error) {
    }
}

render() {
    return (
        <div>
            <div onMouseUp={this.handleMouseUp.bind(this)}>
                <Highlight language="R" className="code">
                    {this.props.code}
                </Highlight>
            </div>
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose.bind(this)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Codelines in Bindings found"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.answerText}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose.bind(this, "close")} color="primary">
                            OK
               </Button>
                        <Button onClick={this.handleClose.bind(this, "tabChange")} color="primary" autoFocus>
                            Go to Manipulate
               </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}
}

export default CodeView;