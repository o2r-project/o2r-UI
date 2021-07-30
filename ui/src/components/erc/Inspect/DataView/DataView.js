import React from 'react';

import CSV from './CSV/CSV';
import Txt from './Txt/Txt';
import JSON from './JSON/JSON';
import FourteenC from './FourteenC/FourteenC';
import Dat from './Dat/Dat';
import Download from './Download/Download';

const DataTable = (props) => {

    let dataFormat = null;
    let dataSize = 0;
    let data = props.data.data;
    for (let i = 0; i < data.tree.length; i++) {
        if (data.tree[i].name === data.datafile) {
            if (data.tree[i].type === undefined){
                dataFormat = data.tree[i].extension; 
            } 
            else {
                dataFormat = data.tree[i].type;
            }
            dataSize = data.tree[i].size;
        }
    }

    if (data.datafile.trim().toLowerCase().indexOf('.rdata') !== -1) {
        dataFormat = '.rdata';
    }
    else if(data.datafile.trim().toLowerCase().indexOf('.csv') !== -1){
        dataFormat= 'text/csv';
    }
    if (data.datafile.split(".").pop() === 'dat') {
        dataFormat= '.dat';
    }
    // 5mb = 5000000 byte
    if (dataSize > 5000000) {
        return <Download file={data.datafile} id={props.data.id} />
    }

    switch (dataFormat) {
        case 'text/csv':
            return <CSV csv={data.data} file={data.datafile} />
        case 'application/json':
            return <JSON json={data.data} file={data.datafile} />
        case '.rdata':
            return <Download file={data.datafile} id={props.data.id} />
        case 'text/plain':
            return <Txt txt={data.data} file={data.datafile} />
        case '.14c':
            return <FourteenC content={data.data} file={data.datafile} />
        case '.dat':
            return <Dat content={data.data} file={data.datafile} />
        case undefined:
            return <Download file={data.datafile} id={props.data.id} />
        default:
            return <div>No data</div>
    }
}

class DataView extends React.Component {
    render() {
        return (
            <div>
                {this.props.data.data
                    ? <DataTable data={this.props} />
                    : ''}
            </div>
        )
    }
}

export default DataView;