import React from 'react';
import Iframe from 'react-iframe';

import './mainview.css';
import Popup from '../Inspect/CodeView/Popup/Popup'
import * as $ from 'jquery';
import 'jquery-highlight';
import { Button} from '@material-ui/core'

var iframe
class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedText: '',
            popup: false,
            title: "",
        }
    }

componentDidMount(){
    iframe= document.getElementById('iframe_id');
    iframe.contentWindow.addEventListener("mouseup", this.handleSelectedText.bind(this))
    window.find("a");
    $(document.body).highlight('a');

    console.log(iframe.contentWindow.document.body)

}


search(){

    var searchWord ="eco"
    var $html = $($('#iframe_id').contents().find('html'));
         $html.highlight("a")
         console.log($html)

         $(document.body).highlight('a');
      
}

handleSelectedText(e) {
    var answerText = ""
    var text= iframe.contentWindow.getSelection().toString();
    var text1= text.replace('=', '<-')
    if (text === '' || text.length < 4) return;
    let bindings = this.props.metadata.interaction;
    let foundParameters = [];
    bindings.forEach(binding => {
        binding.sourcecode.parameter.forEach(parameter => {
            if (parameter.text.indexOf(text) !== -1 || parameter.text.indexOf(text1) !== -1) {
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
    if (foundParameters.length != 0) {
        answerText += " Please check in the \"Manipulate\" view"
        this.setState({ title: "Codeline in Bindings found", selectedText: answerText, popup: true })
    }
}

closePopup = (name, e) => {
    this.setState({ popup: false })
    if (name == "tabChange") 
        this.props.handleTabChange(e, 2);
    }


    render() {
        const url = this.props.filePath;
        return (
            <div>
            <div onMouseUp={this.handleSelectedText.bind(this)} style={{top: 0,left:0, width : "100%", height: "100%", position: "absolute"}}>
            <Iframe id={'iframe_id'} url={url}  className="iframe"/>
            <Popup
                selectedText={this.state.selectedText}
                open={this.state.popup}
                title={this.state.title}
                closePopup={this.closePopup}
            />
            </div>
            <div>
            <Button onClick={this.search.bind(this)}> test </Button>
            </div>
            </div>
   
        )
  }
}

export default MainView;