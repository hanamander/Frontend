import React, { Component, createRef } from "react";
import { styled } from '@mui/material/styles';
import { TableCell } from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const ScoreTooltip = styled(({ className, ...props }) => (

	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({

	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: 'white',
		color: 'rgba(0, 0, 0, 0.87)',
		height: 25,
		fontSize: 18,
		border: '1px solid black',
		padding: 2,

	},
}));

export default class OverflowText extends Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			overflowActive: false
		};

		this.tableCell = createRef();
	}

	isEllipsisActive(e)
	{
		return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
	}

	componentDidMount()
	{
		this.setState({ overflowActive: this.isEllipsisActive(this.tableCell.current) });
	}

	render()
	{
		const { width, key, text } = this.props;
		const { overflowActive } = this.state;

		return ( //hanam
			<TableCell
				sx={{
					width: width,
					fontSize: 36,
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					overflow: "hidden",
					// pointerEvents: "none",
				}}
				ref={this.tableCell}
				key={key}
			>
				{
					overflowActive ? <ScoreTooltip title={text} placement="top">{text}</ScoreTooltip> : text
				}
			</TableCell>
		);
	}
}

