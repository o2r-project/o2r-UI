import React from 'react';
import Highlight from 'react-highlight.js';

class Sourcecode extends React.Component {

    render() {
        return (
            <div>
                <div>
                    <Highlight language="R" className="code">
                        {this.props.code}
                    </Highlight>
                </div>
            </div>
        )}
    }

export default Sourcecode;