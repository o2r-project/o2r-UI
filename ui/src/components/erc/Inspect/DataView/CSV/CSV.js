import React from 'react';
import csvstring from 'csv-string';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';

class CSV extends React.Component {
  
    render () {
        const csv = csvstring.parse(this.props.csv);
        
        return (
            <Paper>
            <Table>
              <TableHead>
                <TableRow>
                    {csv[0].map((cell,index) => (
                        <TableCell component="th" scope="row" key={index}>
                            {cell}
                        </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {csv.slice(1).map((row, index) => (
                <TableRow key={index}>
                    {row.map((cell, index) => (
                        <TableCell component="th" scope="row" key={index}>
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