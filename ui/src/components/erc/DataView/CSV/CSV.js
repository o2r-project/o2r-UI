import React from 'react';
import csvstring from 'csv-string';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';

class CSV extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            csv: csvstring.parse(props.csv),
        };        
        console.log()
    }
  
    render () {
        console.log(this.state.csv)
        return (
            <Paper>
            <Table>
              <TableHead>
                <TableRow>
                    {this.state.csv[0].map(cell => (
                        <TableCell component="th" scope="row">
                            {cell}
                        </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.csv.slice(1).map(row => (
                <TableRow key={row.name}>
                {row.map(cell => (
                    <TableCell component="th" scope="row">
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