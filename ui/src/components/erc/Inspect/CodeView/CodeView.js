import React from 'react';
import Highlight from 'react-highlight.js';

import httpRequests from '../../../../helpers/httpRequests';
import './codeview.css' 

class CodeView extends React.Component {

    handleMouseUp ( e ) {
        try {
            httpRequests.searchBinding(window.getSelection().getRangeAt(0).toString(), this.props.metadata)
            .then(function(res){
               console.log(res)
            })
            .catch(function(res){
                console.log(res);
            })
          } catch (error) {     
        }
    }

    render () {
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