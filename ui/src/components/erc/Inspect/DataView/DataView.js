import React from 'react';

import CSV from './CSV/CSV';
import JSON from './JSON/JSON';
import httpRequests from '../../../../helpers/httpRequests';

const DataTable = (props) => {
    let dataFormat = null; 
    for(let i=0;i<props.data.data.tree.length;i++){
        if (props.data.data.tree[i].name === props.data.data.datafile) {
            if ( props.data.data.tree[i].extension === '.rdata' ) {
                dataFormat = '.rdata';
                httpRequests.getFile("inspection/Jb54y?file=mjoBestUse.RData")
                .then( ( res ) => {
                    console.log(res.data)
                })
            }else{
                dataFormat = props.data.data.tree[i].type
            }

        }
    }
    switch(dataFormat) {
        case 'text/csv':
            return <CSV csv={props.data.data.data} />
        case 'application/json':
            return <JSON json={props.data.data.data[0]} />
        case '.rdata':
            return <JSON json={props.data.data.data[0]} />
        default:
            return <div>No data</div>
    }
}

class DataView extends React.Component {

    render () {
        return (
            <div>
                {this.props.data.data ? 
                    <DataTable data={this.props}></DataTable> : ''}
            </div>
        )
    }
}

export default DataView;