import React from 'react';

import JSONFile from 'react-json-tree';

class JSON extends React.Component {

    render () {
        console.log(this.props.json)
        return (
            <div style={{textAlign:'left'}}>
                <JSONFile data={this.props.json} />
            </div>
        )
    }
}

export default JSON;