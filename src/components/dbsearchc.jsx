import React, { Component, createRef } from "react";

import dayjs from 'dayjs';
import styled from "@emotion/styled";
import { Box, Typography, TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import { purple } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';

import EnhancedTable from "./enhancedtable";

import { SERVER_URL, TAG_MIN1, TAG_MAX1, TAG_MIN2, TAG_MAX2 } from "../dist/global";
import DbSearchPlot from "./dbsearchplot";

const SearchTextBox = styled(Box)({
	width: 80,
	display: "flex",
	backgroundColor: "#e7e4e4",
	justifyContent: "center",
	alignItems: "center",
	marginRight: "8px",
});

const SearchTypography = styled(Typography)({
	fontSize: "20px",
});

const ClearButton = styled(Button)({
	// textTransform: "none",
	color: "white",
	backgroundColor: purple[500],
	'&:hover': {
		backgroundColor: purple[700],
	},
});

const ChartBox = styled(Box)({
	flex: 1,
});

const SearchRefBox = styled(Box)({
	width: 60,
	height: 35,
	backgroundColor: "#e7e4e4",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
});

const SearchCheckbox = styled(Checkbox)({
	color: "#2ab514",
	'&.Mui-checked': {
		color: "#2ab514",
	},
	display: "flex",
	justifyContent: "center",
	alignItems: "center"
});

const CheckBoxWarp = styled(Box)({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
});

export default class dbsearchc extends Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			serialNumber: "",
			id: "",
			timestamp: [dayjs(""), dayjs("")],
			startScore: "",
			endScore: "",
			score: "",
			tagsField: { error: false, label: "", value: "" },

			rows: [],
			openSnackbar: false,
			messageSnackbar: "",
		};

		this.pending = false;
		this.lastSearch = createRef({});
	}

	filterdTags = (tags) =>
	{
		const list = tags.split(",");
		return list.filter((e, i) =>
		{
			const number = Number(e);
			return list.indexOf(e) === i && e !== "" && ((number >= TAG_MIN1 && number <= TAG_MAX1) || (number >= TAG_MIN2 && number <= TAG_MAX2));
		});
	};

	handleChangeSerialNumber = (event) =>
	{
		const onlyNums = event.target.value.replace(/[^0-9]/g, "");
		if (onlyNums.length <= 10)
		{
			this.setState({ serialNumber: onlyNums });
		}
	};

	handleChangeId = (event) =>
	{
		const onlyNums = event.target.value.replace(/[^0-9]/g, "");
		this.setState({ id: onlyNums });
	};

	handleChangeTag = (event) =>
	{
		const onlyNums = event.target.value.replace(/[^0-9|,]/g, "");

		if (onlyNums.length > 100)
		{
			console.log(""); // @@
			return;
		}

		let error = false;

		if (onlyNums !== "")
		{
			const nums = onlyNums.split(",");

			for (const num of nums)
			{
				if (num !== "")
				{
					const number = Number(num);
					if ((number < TAG_MIN1 || number > TAG_MAX1) && (number < TAG_MIN2 || number > TAG_MAX2))
					{
						error = true;
						break;
					}
				}
			}
		}

		this.setState({ tagsField: { error: error, label: error ? `${TAG_MIN1} ~ ${TAG_MAX1} 또는 ${TAG_MIN2} ~ ${TAG_MAX2} 로 입력해 주세요.` : "", value: onlyNums } });
	};

	handleSearch = () =>
	{
		if (this.pending)
		{
			return;
		}

		this.pending = true;

		const startTimestamp = isNaN(this.state.timestamp[0]) ? "" : this.state.timestamp[0];
		const endTimestamp = isNaN(this.state.timestamp[1]) ? "" : this.state.timestamp[1];
		const startScore = this.state.startScore === "" ? 0 : parseFloat(this.state.startScore);
		const endScore = this.state.endScore === "" ? 100 : parseFloat(this.state.endScore);

		if (startScore > endScore)
		{
			this.setState({ openSnackbar: true, messageSnackbar: "시작 점수가 끝 점수보다 큽니다." });
			return;
		}

		if (startTimestamp !== "" && endTimestamp !== "" && startTimestamp > endTimestamp)
		{
			this.setState({ openSnackbar: true, messageSnackbar: "시작 시간이 끝나는 시간보다 큽니다." });
			return;
		}

		const search = JSON.stringify({
			sn: this.state.serialNumber,
			id: this.state.id,
			startTimestamp: startTimestamp,
			endTimestamp: endTimestamp,
			startScore: startScore,
			endScore: endScore,
			tags: JSON.stringify(this.filterdTags(this.state.tagsField.value)),
		});

		if (search === this.lastSearch.current)
		{
			return;
		}

		fetch(`${SERVER_URL}/search`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: search,
		})
			.then(response => response.json())
			.then(json =>
			{
				const { success, message, data } = json;

				if (success === "OK")
				{
					const rows = data.map(e => 
					{
						const score = JSON.parse(e.score).map(s => s.value);
						return { id: e.id, serialNumber: e.sn, timestamp: e.timestamp, dataFilename: e.data_filename, score: score.toString(), tags: JSON.parse(e.tags).toString() };
					});

					this.setState({ rows: rows });
					this.lastSearch.current = search;
				}
				else
				{
					console.log(message);
				}
			})
			.catch(error =>
			{
				console.error(error);
			})
			.finally(() => this.pending = false);
	};

	handleChangeTimestamp = (newValue) =>
	{
		this.setState({ timestamp: newValue });
	};

	handleChangeStartScore = (event) =>
	{
		const onlyNums = event.target.value.replace(/[^0-9]/g, "");
		if (onlyNums.length <= 3 && parseInt(onlyNums) <= 100)
		{
			this.setState({ startScore: onlyNums });
		}
		else
		{
			this.setState({ startScore: "" });
		}
	};

	handleChangeEndScore = (event) =>
	{
		const onlyNums = event.target.value.replace(/[^0-9]/g, "");
		if (onlyNums.length <= 3 && parseInt(onlyNums) <= 100)
		{
			this.setState({ endScore: onlyNums });
		}
		else
		{
			this.setState({ endScore: "" });
		}
	};

	updateSelectedItems = (newSelectedItems) =>
	{
		this.props.updateSelectedItems(newSelectedItems);
	};

	handleClear = () =>
	{
		this.setState({
			serialNumber: "",
			id: "",
			timestamp: [dayjs(""), dayjs("")],
			startScore: "",
			endScore: "",
			score: "",
			tagsField: { error: false, label: "", value: "" }
		});
	};

	render()
	{
		const { rows } = this.state;

		return (
			<Box sx={{ border: "1px solid gray", borderRadius: "16px", p: "24px" }}>
				<Box sx={{ display: "flex" }}>
					<Box sx={{ width: "490px", display: "flex", flexDirection: "column", mr: "16px" }}>
						<Box sx={{ display: "flex", flexDirection: "row", marginBottom: "8px" }}>
							<SearchTextBox>
								<SearchTypography>SN</SearchTypography>
							</SearchTextBox>
							<Box sx={{ display: "flex", flex: 1, justifyContent: "space-between" }}>
								<TextField sx={{ width: "160px" }} value={this.state.serialNumber} onChange={this.handleChangeSerialNumber} />
								<Box sx={{ display: "flex" }}>
									<Button sx={{ marginRight: "8px" }} variant="contained" onClick={this.handleSearch}>Search</Button>
									<ClearButton variant="contained" onClick={this.handleClear}>Clear</ClearButton>
								</Box>
							</Box>
						</Box>

						<Box sx={{ display: "flex", flexDirection: "row", marginBottom: "8px" }}>
							<SearchTextBox>
								<SearchTypography>Ref.ID</SearchTypography>
							</SearchTextBox>
							<TextField sx={{ display: "flex", flex: 1 }} value={this.state.id} onChange={this.handleChangeId} />
						</Box>

						<Box sx={{ display: "flex", flexDirection: "row", marginBottom: "8px" }}>
							<SearchTextBox>
								<SearchTypography>Time</SearchTypography>
							</SearchTextBox>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DemoContainer
									sx={{ display: "flex", flex: 1, paddingTop: "0px" }}
									components={["SingleInputDateTimeRangeField",]}
								>
									<SingleInputDateTimeRangeField
										format="YYYY-MM-DD HH:mm:ss"
										value={this.state.timestamp}
										onChange={this.handleChangeTimestamp}
									/>
								</DemoContainer>
							</LocalizationProvider>
						</Box>

						<Box sx={{ display: "flex", flexDirection: "row", marginBottom: "8px" }}>
							<SearchTextBox><SearchTypography>Tags</SearchTypography></SearchTextBox>
							<TextField
								sx={{ display: "flex", flex: 1 }}
								type="text"
								error={this.state.tagsField.error}
								label={this.state.tagsField.label}
								value={this.state.tagsField.value}
								onChange={this.handleChangeTag}
							/>
						</Box>
						<Box sx={{ display: "flex", flexDirection: "row", marginBottom: "8px" }}>
							<SearchTextBox><SearchTypography>Score</SearchTypography></SearchTextBox>
							<Box sx={{ display: "flex", flexDirection: "row", flex: 1, alignItems: "center" }}>
								<TextField sx={{ display: "flex", flex: 0.5 }} value={this.state.startScore} onChange={this.handleChangeStartScore} ></TextField>
								<Typography sx={{ fontSize: 30, mx: 1.5 }}>~</Typography>
								<TextField sx={{ display: "flex", flex: 0.5 }} value={this.state.endScore} onChange={this.handleChangeEndScore}></TextField>
							</Box>
						</Box>
					</Box>
					<Box sx={{ flex: 1, height: "570px", padding: "4px", border: "1px solid gray", borderRadius: "16px" }}>
						<EnhancedTable rows={rows} selectedItems={[]} updateSelectedItems={this.updateSelectedItems} />
					</Box>
				</Box >
				<Box display="flex" justifyContent="center" width="100%">
					<Box display="flex" flexDirection="column" mt={5} ml={1}>
						<CheckBoxWarp>
							<SearchRefBox><SearchTypography>Ref1</SearchTypography> </SearchRefBox>
							<SearchCheckbox size="large" />
						</CheckBoxWarp>
						<CheckBoxWarp >
							<SearchRefBox><SearchTypography>Ref2</SearchTypography> </SearchRefBox>
							<SearchCheckbox size="large" />
						</CheckBoxWarp>
						<CheckBoxWarp>
							<SearchRefBox><SearchTypography>Ref3</SearchTypography> </SearchRefBox>
							<SearchCheckbox size="large" />
						</CheckBoxWarp>
						<CheckBoxWarp>
							<SearchRefBox><SearchTypography>Ref4</SearchTypography> </SearchRefBox>
							<SearchCheckbox size="large" />
						</CheckBoxWarp>
					</Box>
					<ChartBox>
						<DbSearchPlot  />
					</ChartBox>
				</Box>
			</Box>
		);
	}
};