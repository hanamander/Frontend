import React, { Component } from "react";

import styled from "@emotion/styled";
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import MeasureSelect from "./measureselect";
import { TABLE_HEAD_COLOR } from "../dist/global";

const TableCellHead = styled(TableCell)({
    backgroundColor: TABLE_HEAD_COLOR,
});

const ReferenceTableCell = styled(TableCell)({
});

const MeasureRefsTextField = styled(TextField)({
    width: "70px",
});

const columns = [
    { id: "check", label: " ", align: "center" },
    { id: "id", label: "Ref.ID", align: "center" },
    { id: "timestamp", label: "Time", align: "center" },
    { id: "tags", label: "Tags", align: "center" },
    { id: "inv", label: "Inv", align: "center" },
    { id: "min", label: "R.Min", align: "center" },
    { id: "max", label: "R.Max", align: "center" },
    { id: "score", label: " ", align: "center" },
    { id: "eq", label: "EQ", align: "center" },
    { id: "remove", label: " ", align: "center" },
];

export default class MeasureTable extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
        };
    }

    handleChangeRefsVisible = (refs, index, checked) =>
    {
        if (refs[index])
        {
            const newRefs = [...refs];
            newRefs[index].visible = checked;
            this.props.handleUpdate(newRefs);
        }
    }

    handleChangeRefsInv = (refs, index, checked) =>
    {
        if (refs[index])
        {
            const newRefs = [...refs];
            newRefs[index].inv = checked;
            this.props.handleUpdate(newRefs);
        }
    }

    handleChangeRefsMin = (refs, index, value) =>
    {
        const onlyNums = value.replace(/[^0-9]/g, "");
        if (onlyNums > 100)
        {
            return;
        }

        if (refs[index])
        {
            const newRefs = [...refs];
            newRefs[index].min = onlyNums;
            this.props.handleUpdate(newRefs);
        }
    }

    handleChangeRefsMax = (refs, index, value) =>
    {
        const onlyNums = value.replace(/[^0-9]/g, "");
        if (onlyNums > 100)
        {
            return;
        }

        if (refs[index])
        {
            const newRefs = [...refs];
            newRefs[index].max = onlyNums;
            this.props.handleUpdate(newRefs);
        }
    }

    handleChangeRefsEq = (refs, index, eq) =>
    {
        if (refs[index])
        {
            const newRefs = [...refs];
            newRefs[index].eq = eq;
            this.props.handleUpdate(newRefs);
        }
    };

    handleClickRefsRemove = (refs, index) =>
    {
        if (refs[index])
        {
            const newRefs = refs.filter((e, i) => index !== i);
            this.props.handleUpdate(newRefs);
        }
    };

    render()
    {
        const { start, refs } = this.props;
        return (
            <Paper>
                <TableContainer sx={{ height: "270px" }}>
                    <Table stickyheader aria-label="sticky table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCellHead align="center" colSpan={4}>
                                    Reference
                                </TableCellHead>
                                <TableCellHead align="center" colSpan={3} >
                                    Settings
                                </TableCellHead>
                                <TableCellHead align="center" colSpan={3} >
                                    Score
                                </TableCellHead>
                            </TableRow>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCellHead
                                        key={column.id}
                                        align={column.align}
                                        style={{ top: 37, minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCellHead>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                refs.map((ref, index) => (                                    
                                    <TableRow hover role="checkbox" tabIndex={-1} key={ref.code}>
                                        {
                                            columns.map((column) =>
                                            {                                                
                                                const value = ref[column.id];
                                                if (column.id === "check")
                                                {
                                                    return (
                                                        <ReferenceTableCell key={column.id} align={column.align}>
                                                            <Checkbox
                                                                checked={ref.visible}
                                                                onChange={(event) => { this.handleChangeRefsVisible(refs, index, event.target.checked) }}
                                                            />
                                                        </ReferenceTableCell>
                                                    );
                                                }
                                                else if (column.id === "inv")
                                                {
                                                    return (
                                                        <ReferenceTableCell key={column.id} align={column.align}>
                                                            <Checkbox
                                                                disabled={start}
                                                                checked={ref.inv}
                                                                onChange={(event) => { this.handleChangeRefsInv(refs, index, event.target.checked) }}
                                                            />
                                                        </ReferenceTableCell>
                                                    );
                                                }
                                                else if (column.id === "min")
                                                {
                                                    return (
                                                        <ReferenceTableCell key={column.id} align={column.align}>
                                                            <MeasureRefsTextField dis size="small" disabled={start} value={ref.min} onChange={(event) => { this.handleChangeRefsMin(refs, index, event.target.value) }}></MeasureRefsTextField>
                                                        </ReferenceTableCell>
                                                    );
                                                }
                                                else if (column.id === "max")
                                                {
                                                    return (
                                                        <ReferenceTableCell key={column.id} align={column.align}>
                                                            <MeasureRefsTextField size="small" disabled={start} value={ref.max} onChange={(event) => { this.handleChangeRefsMax(refs, index, event.target.value) }}></MeasureRefsTextField>
                                                        </ReferenceTableCell>
                                                    );
                                                }
                                                else if (column.id === "eq")
                                                {
                                                    return (
                                                        <ReferenceTableCell key={column.id} align={column.align}>
                                                            <MeasureSelect start={start} eq={ref.eq} handleUpdate={(eq) => { this.handleChangeRefsEq(refs, index, eq) }} />
                                                        </ReferenceTableCell>
                                                    );
                                                }
                                                else if (column.id === "remove")
                                                {
                                                    return (
                                                        <ReferenceTableCell key={column.id} align={column.align}>
                                                            <IconButton aria-label="delete" disabled={start} color="primary">
                                                                <DeleteIcon
                                                                    aria-label="delete"
                                                                    size="small"
                                                                    onClick={(event) => this.handleClickRefsRemove(refs, index)}
                                                                    sx={{ color: "gray", padding: "0px", cursor: "pointer" }}
                                                                />
                                                            </IconButton>
                                                        </ReferenceTableCell>
                                                    );
                                                }
                                                else
                                                {
                                                    return (
                                                        <ReferenceTableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === "number" ? column.format(value) : value}
                                                        </ReferenceTableCell>
                                                    );
                                                }
                                            })}
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        );
    }
};