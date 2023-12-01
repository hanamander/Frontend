import React, { Component } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default class SelectedTable extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {};
    }

    render() 
    {
        const { selectedItems } = this.props;

        return (
            <TableContainer>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>RefID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedItems.map(e => (
                            <TableRow
                                key={e.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{e.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}
