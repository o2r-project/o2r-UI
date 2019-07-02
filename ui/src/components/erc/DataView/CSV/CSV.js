import React from 'react';
import csvstring from 'csv-string';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import uuid from 'uuid/v1';

class CSV extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render () {
        const csv = csvstring.parse(this.props.csv);
        
        return (
            <Paper>
            <Table>
              <TableHead>
                <TableRow>
                    {csv[0].map(cell => (
                        <TableCell component="th" scope="row" key={uuid()}>
                            {cell}
                        </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {csv.slice(1).map(row => (
                <TableRow key={uuid()}>
                    {row.map(cell => (
                        <TableCell component="th" scope="row" key={uuid()}>
                            {cell}
                        </TableCell>
                    ))}
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )
    }
}

export default CSV;