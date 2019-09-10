import React from 'react';
import Iframe from 'react-iframe';

import './mainview.css';
import { width, height } from '@material-ui/system';

var iframe
class MainView extends React.Component {

componentDidMount(){
    //window.addEventListener("message", this.handleSelectedText.bind(this))
    iframe= document.getElementById('iframe_id');
    console.log(iframe)
    iframe.contentWindow.addEventListener("mouseup", this.handleSelectedText.bind(this))
}
handleSelectedText(e) {
    var answerText = ""
    var text= iframe.contentWindow.getSelection().toString()
    //var text = window.getSelection().getRangeAt(0).toString();
    console.log(text)
    console.log(1)
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

    if (foundParameters.length != 0) {
        answerText = "This Codeline is the Parameter for "

        for (var i = 0; i < foundParameters.length - 1; i++) {
            answerText += foundParameters[i].computationalResult.result + " and ";
        }
        answerText += foundParameters[foundParameters.length - 1].computationalResult.result + ". "
        
    }
    console.log(answerText)
}

    render() {
        const url = this.props.filePath;
        return (
            <div onMouseUp={this.handleSelectedText.bind(this)} style={{top: 0,left:0, width : "100%", height: "100%", position: "absolute"}}>
            <Iframe id={'iframe_id'} url={url}  className="iframe"/>
            
            </div>
   
        )
  }
}

export default MainView;