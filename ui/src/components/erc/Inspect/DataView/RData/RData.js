import React from 'react';

import JSONFile from 'react-json-tree';

class RData extends React.Component {
    
    render () {
        return (
            <div style={{textAlign:'left'}}>
                <JSONFile 
                    data={this.props.rdata} 
                />
            </div>
        )
    }
}

export default RData;