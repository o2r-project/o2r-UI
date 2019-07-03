import React from 'react';
import Highlight from 'react-highlight.js';

import './codeview.css' 

class CodeView extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render () {

        return (
            <div>
                <Highlight language="R" className="code">
                    {this.props.code.file.data}
                </Highlight>
            </div>
        )
  }
}

export default CodeView;