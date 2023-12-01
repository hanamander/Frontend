import React, { Component } from "react";

import { Box, Button, Table, Typography, FormGroup, FormControlLabel, Checkbox, Paper } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from "@emotion/styled";

import RadarChart from "./radarchart";
import RadarSubChart from "./radarsubchart"

const DataTableCell = styled(TableCell)({
	fontSize: "20px",
});

const DetailButton = styled(Button)({
	width: "140px",
	height: "40px",
	fontSize: "19px",
	backgroundColor: "#3a466c",
	color: "white",
	margin: 5,
	textTransform: "none"
});

const RefBox = styled(Box)({
	width: 75,
	height: 35,
	backgroundColor: "#e7e4e4",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	marginRight: 10
});

const RefTypography = styled(Typography)({
	fontSize: "20px",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	marginLeft: 2,
});

const RefSebTypography = styled(Typography)({
	fontSize: "20px",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	marginLeft: 10,
});

const SetRefButton = styled(Button)({
	width: "140px",
	height: "40px",
	fontSize: "20px",
	backgroundColor: "red",
	color: "white",
	textTransform: "none",
	margin: 5
});

function createData(id, sn, time, score, tag1, tag2, cfgs)
{
	return { id, sn, time, score, tag1, tag2, cfgs };
}

const rows = [
	createData(1025, 100101, 230527114235, "(11142,1,99.1),(11145,1,88.5),(11145,2,95.5)", "(1005,1007)", "(2003)", "(3,13.6,4000,5,30)")
];

export default class DataDetails extends Component
{
	render()
	{
		return (
			<Box width="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={5} mx={0}>
				<Box display="flex" justifyContent="space-between" alignItems="center" width="100%" >
					<Box width="100%">
						<TableContainer component={Paper} elevation={0}>
							<Table sx={{ minWidth: 650, }} size="small" aria-label="a dense table">
								<TableHead>
									<TableRow>
										<DataTableCell align="center">ID</DataTableCell>
										<DataTableCell align="center">SN</DataTableCell>
										<DataTableCell align="center">Time</DataTableCell>
										<DataTableCell align="center">Score</DataTableCell>
										<DataTableCell align="center">Tag1</DataTableCell>
										<DataTableCell align="center">Tag2</DataTableCell>
										<DataTableCell align="center">cfgs</DataTableCell>
									</TableRow>
								</TableHead>
								<TableBody elevation={0}>
									{rows.map((row) => (
										<TableRow elevation={0}>
											<TableCell sx={{ border: "1px solid white" }} align="center">{row.id}</TableCell>
											<TableCell sx={{ border: "1px solid white" }} align="center">{row.sn}</TableCell>
											<TableCell sx={{ border: "1px solid white" }} align="center">{row.time}</TableCell>
											<TableCell sx={{ border: "1px solid white" }} align="center">{row.score}</TableCell>
											<TableCell sx={{ border: "1px solid white" }} align="center">{row.tag1}</TableCell>
											<TableCell sx={{ border: "1px solid white" }} align="center">{row.tag2}</TableCell>
											<TableCell sx={{ border: "1px solid white" }} align="center">{row.cfgs}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
					<Box display="flex" flexDirection="column" ml={10} mr={5}>
						<DetailButton variant="contained">Tagging</DetailButton>
						<DetailButton variant="contained">CSV Export</DetailButton>
					</Box>
				</Box>
				<Box display="flex">
					<RadarChart />
					<RadarSubChart />
				</Box>
				<Box width="100%" display="flex" justifyContent="space-between" m={5}>
					<Box display="flex">
						{[1, 2, 3, 4].map((ref) => (
							<Box key={ref} mx={5}>
								<Box display="flex">
									<RefBox>
										<RefTypography>Ref{ref}</RefTypography>
									</RefBox>
									<RefTypography>Ref 정보</RefTypography>
								</Box>
								<Box>
									<FormGroup>
										<Box display="flex">
											<FormControlLabel
												control={<Checkbox size="large" sx={{
													color: "#2ab514",
													'&.Mui-checked': {
														color: "#2ab514",
													},
												}} />} label="EQ1"
											/>
											<RefSebTypography>95.2</RefSebTypography>
										</Box>
										<Box display="flex">
											<FormControlLabel
												control={<Checkbox size="large" sx={{
													color: "#2ab514",
													'&.Mui-checked': {
														color: "#2ab514",
													},
												}} />} label="EQ2" />
											<RefSebTypography>84.5</RefSebTypography>
										</Box>
										<Box display="flex">
											<FormControlLabel
												control={<Checkbox size="large" sx={{
													color: "#2ab514",
													'&.Mui-checked': {
														color: "#2ab514",
													},
												}} />} label="EQ3" />
											<RefSebTypography>0.0</RefSebTypography>
										</Box>
									</FormGroup>
								</Box>
								<Box>
									<DetailButton variant="contained">Calculate</DetailButton>
								</Box>
							</Box>
						))}
					</Box>
					<Box mr={5}>
						<SetRefButton variant="contained">Set Ref</SetRefButton>
					</Box>
				</Box>
			</Box>
		);
	}
};