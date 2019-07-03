import React from 'react';

import CSV from './CSV/CSV';

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
        case 'Rdata':
            return <div>rdata</div>
        default:
            return <div>No data</div>
    }
  }

class DataView extends React.Component {
    constructor(props) {
        super(props);    
    }
  
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