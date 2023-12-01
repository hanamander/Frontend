import React, { Component } from "react";

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { SERVER_URL } from "../dist/global";
import OverflowText from "./overflowtext";

export default class Main extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            header: [],
            rows: {},
        };

        this.pending = false;
    }

    componentDidMount()
    {
        this.fetchOperation();
    }

    fetchOperation = () =>
    {
        if (this.pending)
        {
            return;
        }

        this.pending = true;

        fetch(`${SERVER_URL}/operation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((json) =>
            {
                const { success, message, data } = json;

                if (success === "OK")
                {
                    const { header, rows } = data;
                    console.log(json);
                    const MAX_COLUMN_SIZE = 10;
                    const isMaximum = header.length === MAX_COLUMN_SIZE;

                    this.setState({ header: isMaximum ? header : header.concat(Array(1).fill("")), rows: isMaximum ? rows : this.addEmptyElement(rows) });
                }
                else
                {
                    console.log(message);
                }
            })
            .catch((error) =>
            {
                console.error(error);
            })
            .finally(() => this.pending = false);
    };

    addEmptyElement = (rows) =>
    {
        let newRows = [];
        for (const e of rows)
        {
            newRows.push(e.concat(Array(1).fill("")));
        }
        return newRows;
    };

    render()
    {
        const { header, rows } = this.state;
        const NUMBER_WIDTH = 182 - 32;
        const CELL_WIDTH = 140 - 32;

        const tableCellStyle = {
            width: NUMBER_WIDTH,
            fontSize: 16, // 폰트 크기 수정
        };

        return (
            <Box sx={{ width: "100%", height: "100%", border: "1px solid gray", borderRadius: 4, }}>
                <Box sx={{ width: "100%", height: "100%", overflowY: "scroll", overflowX: "hidden" }}>
                    <TableContainer>
                        <Table sx={{ tableLayout: "fixed" }}>
                            <TableHead stickyheader aria-label="sticky table">
                                <TableRow>
                                    <TableCell sx={tableCellStyle}></TableCell>
                                    {
                                        header.map((e, i) =>
                                        {
                                            return (
                                                e === "" ? <TableCell key={i}>{e}</TableCell> : <TableCell sx={{ width: CELL_WIDTH, fontSize: 24 }} key={i}>{e}</TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.values(rows).map((e, i) =>
                                {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell sx={tableCellStyle}>{`score${i + 1}`}</TableCell>
                                            {
                                                e.map((cell, cellIndex) =>
                                                {
                                                    return <OverflowText  width={CELL_WIDTH} key={cellIndex} text={cell.replace(/,/g, ", ")}></OverflowText>
                                                })
                                            }
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

        );
    }
};
