import React from 'react';

import CSV from './CSV/CSV';
import JSON from './JSON/JSON';
import RData from './RData/RData';
import Download from './Download/Download';

const DataTable = (props) => {
    
    let dataFormat = null; 
    let dataSize =0;
    let data = props.data.data;
    for( let i=0; i<data.tree.length; i++ ) {
        if ( data.tree[i].name === data.datafile ) {
            dataFormat = data.tree[i].type
            dataSize = data.tree[i].size
            console.log(dataSize)
        }
        if ( data.datafile.trim().toLowerCase().indexOf('.rdata') !== -1 ) {
            dataFormat = '.rdata';
        }
    }
 // 5mb = 5000000 byte
    if(dataSize > 5000000){
        return <Download file={data.datafile} id={props.data.id}/>
    }
    
    switch(dataFormat) {
        case 'text/csv':
            return <CSV csv={data.data} file={data.datafile} />
        case 'application/json':
            return <JSON json={data.data[0]} file={data.datafile} />
        case '.rdata':
            return <RData rdata={data.data} id={props.data.id}/>
        default:
            return <div>No data</div>
    }
}

class DataView extends React.Component {
    render () {
        return (
            <div>
                {this.props.data.data 
                ?<DataTable data={this.props} /> 
                : ''}
            </div>
        )
    }
}

export default DataView;