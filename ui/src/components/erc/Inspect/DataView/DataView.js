import React from 'react';

import CSV from './CSV/CSV';
import JSON from './JSON/JSON';


const DataTable = (props) => {
    let dataFormat = null; 
    for(let i=0;i<props.data.data.tree.length;i++){
        if (props.data.data.tree[i].name === props.data.data.datafile) {
            dataFormat = props.data.data.tree[i].type
        }
    }
    switch(dataFormat) {
        case 'text/csv':
            return <CSV csv={props.data.data.data} file={props.data.data.datafile}>csv</CSV>
        case 'application/json':
            return <JSON json={props.data.data.data[0]} file={props.data.data.datafile}>json</JSON>
        default:
            return <div>No data</div>
    }
}

class DataView extends React.Component {

    render () {
        console.log(this.props)
        return (
            <div>
                {this.props.data.data ? 
                    <DataTable data={this.props}></DataTable> : ''}
            </div>
        )
    }
}

export default DataView;