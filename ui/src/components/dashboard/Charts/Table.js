import React, { Component } from 'react'
import { Paper, Table, TableBody, TableContainer, TableRow, TableCell, TableHead } from '@material-ui/core'
import './charts.css'


class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ value: 2, label: new Date(2019, 5) }, { value: 3, label: new Date(2019, 6) }, { value: 4, label: new Date(2019, 7) }, { value: 5, label: new Date(2019, 8) }, { value: 5, label: new Date(2019, 8) }]
        };
    };


    render() {
        return (
            <Paper style={{height: "100%"}}>
                <TableContainer style={{height: "100%"}} >
                    <Table stickyHeader aria-label="sticky table" size="small" style={{height: "100%"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align={"center"}>
                                    Value
                                 </TableCell>
                                <TableCell align={"center"}>
                                    Date
                                 </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.data.map(row => {
                                return(
                                    <TableRow hover>
                                        <TableCell align={"center"}>
                                            {row.value}
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            {row.label.toDateString()}
                                        </TableCell>                                      
                                    </TableRow>
                                )})
    }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }

}

export default TableView