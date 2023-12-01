import React, { Component } from "react";

import { Box, Typography, Button, Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styled from "@emotion/styled";

const IrisSensorTypography = styled(Typography)({
	fontSize: "35px",
	fontWeight: "600",
	color: "red",
});

const CalibrationButton = styled(Button)({
	width: "150px",
	height: "45px",
	fontSize: "20px",
	backgroundColor: "red",
	textTransform: "none",
});

const ConfigsButton = styled(Button)({
	width: "140px",
	height: "40px",
	fontSize: "20px",
	backgroundColor: "#3a466c",
	color: "white",
	marginRight: 20,
	textTransform: "none"
});

const ParameterBox = styled(Box)({
	width: "100%",
	height: "270px",
	backgroundColor: "#d9d9d9",
	borderRadius: "10px"
});

function createData(name, value)
{
	return { name, value };
}

const rows = [
	createData("Freq.Min", 3.0),
	createData("Freq.Max", 13.6),
	createData("Num. of Point", 5001),
	createData("Num. of Avrg.", 5),
	createData("IFBW", 30),
];

export default class IrisConfigs extends Component
{
	render()
	{
		return (
			<>
				<Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={5} mx={10}>
					<Box width="100%" display="flex">
						<Box width="50%">
							<IrisSensorTypography>100101</IrisSensorTypography>
						</Box>
						<Box width="50%" display="flex" justifyContent="flex-end">
							<CalibrationButton variant="contained">Calibration</CalibrationButton>
						</Box>
					</Box>
					<Box mt={15} display="flex" justifyContent="center" width="100%">
						<Box width="50%" display="flex" justifyContent="center" flexDirection="column" m={5}>
							<Box mb={10} display="flex" justifyContent="center">
								<ConfigsButton variant="contained">Load</ConfigsButton>
								<ConfigsButton variant="contained">Set</ConfigsButton>
							</Box>
							<Box>
								<Typography>configuration</Typography>
								<Box sx={{border:"1px solid black"}}>
									<Table>
										<TableContainer component={Paper}>
											<Table sx={{ minWidth: 200 }} aria-label="simple table">
												<TableHead>
												</TableHead>
												<TableBody>
													{rows.map((row) => (
														<TableRow
															key={row.name}
															sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
														>
															<TableCell component="th" scope="row">
																{row.name}
															</TableCell>
															<TableCell align="right">{row.value}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</Table>
								</Box>
							</Box>
						</Box>
						<Box width="50%" display="flex" justifyContent="center" flexDirection="column" m={5}>
							<Box mb={10} display="flex" justifyContent="center">
								<ConfigsButton variant="contained">Load</ConfigsButton>
								<ConfigsButton variant="contained">Set</ConfigsButton>
							</Box>
							<Typography>Calibration parameter</Typography>
							<Box width="100%">
								<ParameterBox></ParameterBox>
							</Box>
						</Box>
					</Box>
					<Box width="100%" display="flex" justifyContent="center" my={5}>
						<ConfigsButton variant="contained">Import</ConfigsButton>
						<ConfigsButton variant="contained">Export</ConfigsButton>
					</Box>
				</Box>
			</>
		);
	}
};