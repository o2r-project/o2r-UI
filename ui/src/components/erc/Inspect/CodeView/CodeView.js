import React from 'react';
import Highlight from 'react-highlight.js';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import httpRequests from '../../../../helpers/httpRequests';
import './codeview.css'


class CodeView extends React.Component {


    handleMouseUp(e) {
        var self = this;
        console.log(e)
        var target= e.currentTarget
        try {
            httpRequests.searchBinding(window.getSelection().getRangeAt(0).toString(), this.props.metadata)
                .then(function (res) {
                    console.log(res)

                    var answerText
                    if (res.data.data.length != 0) {
                        var answerText = "To manipulate this codeline please check ";
                        for (var i = 0; i < res.data.data.length - 1; i++) {
                            answerText += res.data.data[i] + " or "
                        }
                        answerText += res.data.data[res.data.data.length - 1] + " in the \"Manipulate\" view"

                    } else {
                        answerText = "Sadly, there is no Figure to Manipulate for this code"
                    }
                    alert(answerText);
                })
                .catch(function (res) {
                    console.log(res);
                })
        } catch (error) {
        }
    }

    render() {
        const open = Boolean(this.state.anchorEl);
        const id = open ? 'simple-popover' : undefined;
        return (
            <div onMouseUp={this.handleMouseUp.bind(this)}>
                <Highlight language="R" className="code">
                    {this.props.code}
                </Highlight>
            </div>
        )
    }
}

export default CodeView;