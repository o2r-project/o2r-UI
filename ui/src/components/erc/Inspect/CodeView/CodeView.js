import React from 'react';

import './codeview.css';
import Sourcecode from './Sourcecode/Sourcecode';
import Popup from './Popup/Popup';
import httpRequests from '../../../../helpers/httpRequests';

class CodeView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedText:'',
            popup:false,
        }
    }

    handleSelectedText ( e ) {
        let self = this;
        let text = window.getSelection().getRangeAt(0).toString();
        if (text==='') return;
        let bindings = this.props.metadata.interaction;
        let foundParameters = [];
        bindings.forEach(binding => {
            binding.sourcecode.parameter.forEach(parameter => {
                if ( parameter.text.indexOf(text) !== -1 ) {
                    foundParameters.push(binding);
                } 
            })
        });

        httpRequests.searchBinding(text, this.props.metadata)
        .then(function (res) {
            console.log(res)
            if ( text.trim() != '' ) {
                self.setState({
                    selectedText:text,
                    popup:true,
                })
            }
            /*if (res.data.data.length != 0) {
                    for (var i in res.data.data) {
                        for (var j in figures) {
                            if (res.data.data[i] == figures[j]) {
                                console.log(true)
                                res.data.data.splice(i, 1)
                            }
                        }
                    }
                    if (res.data.data[i] == figures[j]) {
                        parameter = true;
                    }
                    for (var i = 0; i < res.data.data.length - 1; i++) {
                        answerText += res.data.data[i] + " and "
                    }
                    answerText += res.data.data[res.data.data.length - 1] + " using this Codeline. Please check in the \"Manipulate\" view"
                }
                if(figures.length != 0 || res.data.data.length != 0) {
                    self.setState({answerText: answerText, open: true})
                }
            })
            .catch (function (res) {
                console.log(res);
            })
        } 
        catch(error) {*/
        });
    }

    closePopup () {
        this.setState({
            popup:false,
        })
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
                    closePopup={this.closePopup.bind(this)}
                />
            </div>
        )
    }
}

export default CodeView;