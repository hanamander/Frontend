import React, { Component } from "react";

import { Box, TextField, Typography, Button } from "@mui/material";
import styled from "@emotion/styled";

const LoginBox = styled(Box)({
	display:"flex",
	flexDirection:"column",
});

const LoginTypography = styled(Typography)({
	fontSize: "25px",
	fontWeight: 600,
	color: "white",
});

const LoginButton = styled(Button)({
	width: "150px",
	backgroundColor: "#5874c8"
});

const LoginTextField = styled(TextField)({
	"& input": {
		color: "white",
	},
	"& .MuiInputLabel-root": {
		color: "white",
	},
});

export default class Login extends Component
{
	render()
	{
		return (
			<Box sx={{ width: "100%", height: "90%" }}>
				<Box display="flex" justifyContent="center" alignItems="center">
					<Box m={35}
						sx={{
							width: "250px",
							height: "350px",
							backgroundColor: "#3a466c",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
							borderRadius: "5%",
						}}
					>
						<LoginBox>
							<Box display="flex" justifyContent="center" mb={5}>
								<LoginTypography>Login</LoginTypography>
							</Box>
							<Box display="flex" flexDirection="column">
								<LoginTextField placeholder="KEY" size="small" margin="dense"></LoginTextField>
								<Box display="flex" justifyContent="center" mt={3}>
									<LoginButton variant="contained">Login</LoginButton>
								</Box>
							</Box>
						</LoginBox>
					</Box>
				</Box>
			</Box>
		);
	}
}