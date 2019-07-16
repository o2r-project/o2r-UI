import React from 'react';
import Highlight from 'react-highlight.js';

import './codeview.css' 

class CodeView extends React.Component {

    render () {
        return (
            <div>
                <Highlight language="R" className="code">
                    {this.props.code}
                </Highlight>
            </div>
        )
  }
}

export default CodeView;