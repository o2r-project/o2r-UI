import React from 'react';

import './codeview.css';
import Sourcecode from './Sourcecode/Sourcecode';
import Popup from './Popup/Popup';
import httpRequests from '../../../../helpers/httpRequests';

class CodeView extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        selectedText: '',
        popup: false,
        title: "",
    }
}

handleSelectedText(e) {
    var self = this;
    var answerText = "";
    try{
    var text = window.getSelection().getRangeAt(0).toString();
    }catch(err){
        return;
    }
    if (text === '' || text.length < 4) return;
    let bindings = this.props.metadata.interaction;
    let foundParameters = [];
    bindings.forEach(binding => {
        binding.sourcecode.parameter.forEach(parameter => {
            if (parameter.text.indexOf(text) !== -1) {
                foundParameters.push(binding);
            }
        })
    });

    if (foundParameters.length !== 0) {
        answerText = "This Codeline is the Parameter for "

        for (var i = 0; i < foundParameters.length - 1; i++) {
            answerText += foundParameters[i].computationalResult.result + " and ";
        }
        answerText += foundParameters[foundParameters.length - 1].computationalResult.result + ". "
    }

    try {
        httpRequests.searchBinding(text, this.props.metadata)
            .then(function (res) {

                for (var i in res.data.data) {
                    for (var j in foundParameters) {
                        if (res.data.data[i] === foundParameters[j].computationalResult.result) {
                            res.data.data.splice(i, 1)
                        }
                    }
                }
                if (res.data.data.length !== 0) {
                    for (i = 0; i < res.data.data.length - 1; i++) {
                        answerText += res.data.data[i] + " and "
                    }
                    answerText += res.data.data[res.data.data.length - 1] + " using this Codeline."

                }

                if (foundParameters.length !== 0 || res.data.data.length !== 0) {
                    answerText += " Please check in the \"Manipulate\" view"
                    self.setState({ title: "Codeline in Bindings found", selectedText: answerText, popup: true })
                }
            })
            .catch(function (res) {
                console.log(res);
            })
    } catch (error) {
    }
}


closePopup = (name, e) => {
    this.setState({ popup: false })
    if (name === "tabChange") {
        console.log(true)
        this.props.handleTabChange(e, 2);
    }
}

render() {
    return (
        <div
            onMouseUp={this.handleSelectedText.bind(this)}>
            <Sourcecode
                code={this.props.code}
            />
            <Popup
                selectedText={this.state.selectedText}
                open={this.state.popup}
                title={this.state.title}
                closePopup={this.closePopup}
            />
        </div>
    )
}

}

export default CodeView;