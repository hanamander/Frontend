import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class PolarChart extends Component
{
	constructor(props)
	{
		super(props);
		this.timer = null;
		this.data = [
			{
				type: 'scatterpolar',
				r: [40, 40, 30, 40, 40, 40, 37, 40, 40, 40, 40, 40, 40, 40, 39, 40, 40, 40, 40, 40, 40, 40, 30, 40, 40, 38, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 30, 40, 40, 40, 37, 40, 40, 40, 40, 40, 40, 40, 39, 40, 40, 40, 40, 40, 40, 40, 30, 40, 40, 38, 40, 40, 40, 40, 40, 40, 40, 40, 40,40, 40, 30, 40, 40, 40, 37, 40, 40, 40, 40, 40, 40, 40, 39, 40, 40, 40, 40, 40, 40, 40, 30, 40, 40, 38, 40, 40, 40, 40, 40, 40, 40, 40, 40,40, 40, 30, 40, 40, 40, 37, 40, 40, 40, 40, 40, 40, 40, 39, 40, 40, 40, 40, 40, 40, 40, 30, 40, 40, 38, 40, 40, 40, 40, 40, 40, 40, 40, 40,40,40, 40, 40, 40, 40, 40, 40, 40, 40,40, 40, 40, 40, 40, 40, 40, 40, 40,40,40, 35, 40, 40, 40, 40, 40, 40, 40,40, 40, 40, 40, 40, 40, 40, 40, 40,40,40, 40, 40, 40, 40, 40, 40, 40, 40,40],
				mode: 'lines',
				name: 'Data 1',
			},
			{
				type: 'scatterpolar',
				r: [30, 30, 20, 29, 30, 30, 30, 30, 30, 30, 30, 25, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 25, 30, 30, 30, 30, 30, 30, 27, 30, 30, 30, 30, 30,30, 30, 20, 29, 30, 30, 30, 30, 30, 30, 30, 25, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 25, 30, 30, 30, 30, 30, 30, 27, 30, 30, 30, 30, 30,30, 30, 20, 29, 30, 30, 30, 30, 30, 30, 30, 25, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 25, 30, 30, 30, 30, 30, 30, 27, 30, 30, 30, 30, 30],
				mode: 'lines',
				name: 'Data 2',
			}
		];
	}

	componentDidMount()
	{
		this.timer = setInterval(this.updateData, 400); // 1초마다 데이터 업데이트
	}

	updateData = () =>
	{
		const newData = this.data.map((item) =>
		{
			const r = item.r.slice(1); // 첫 번째 값 제거
			r.push(item.r[0]); // 마지막 값 추가
			return { ...item, r };
		});

		this.data = newData;
		this.forceUpdate(); // 데이터 업데이트 후 화면 갱신
	};

	render()
	{
		const layout = {
			polar: {
				radialaxis: {
					visible: true,
					showticklabels: false,
					range: [0, 50],
					showline: false,
					ticklen:0,
					showgrid: true,
				},
				angularaxis: {
					visible: true,
					direction: "counterclockwise",
					tickvals:[0, 45, 90, 135, 180, 225, 270, 315],
					ticktext :["3.0", " 4.38", "5.75", "7.12", "8.5", "9.88", "11.25", "12.62", "3.0"],
					ticklen: 0,
				}
			},
			legend: {
				x: 1,
				y: 0,
				showlegend: true
			}
		};

		return (
			<Plot
				data={this.data}
				layout={layout}
				style={{ width: '100%', height: '500px' }}
			/>
		);
	}
}

export default PolarChart;
