import React, { Component } from "react";

import { Box } from "@mui/material";

import Plot from 'react-plotly.js';

export default class MeasurePlot extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { width: 700, height: 450 };

        this.plotRef = React.createRef();
    }

    componentDidMount()
    {
        this.setState({ width: this.plotRef.current.clientWidth, height: this.plotRef.current.clientHeight })
    }

    makeChartData = (refs, refScore) =>
    {
        //
        let newRefScore = JSON.parse(JSON.stringify(refScore));
        let removeKeys = [];
        for (const key of Object.keys(newRefScore))
        {
            let visible = true;
            for (const ref of refs)
            {
                if (key === String(ref.id))
                {
                    visible = ref.visible;
                    break;
                }
            }

            if (visible === false)
            {
                removeKeys.push(key);
            }
        }

        for (const e of removeKeys)
        {
            delete newRefScore[e];
        }

        //
        const length = Object.keys(newRefScore).length;
        const tickvals = Array.from({ length: length * 2 + 1 }, (_, i) => i * 50);
        const ticktext = Array.from({ length: length * 2 + 1 }, (_, i) => i === 0 ? 0 : i % 2 === 0 ? 100 : 50);

        let data = [];
        for (const [index, value] of Object.values(newRefScore).entries())
        {
            const sum = (length - 1 - index) * 100;

            for (const v of Object.values(value))
            {
                v.y = v.y.map(e => e + sum);
                data.push(v);
            }
        }

        for(const e of data)
        {
            e.x = e.x.slice(-25);
            e.y = e.y.slice(-25);
        }

        return { data: data, tickvals: tickvals, ticktext: ticktext };
    };

    render()
    {
        const { refs, refScore } = this.props;
        const { width, height } = this.state;

        const chart = this.makeChartData(refs, refScore);
        const { data, tickvals, ticktext } = chart;

        return (
            <Box ref={this.plotRef} sx={{ width: "100%", height: "100%" }}>
                <Plot
                    data={data}
                    layout={{
                        autosize: false,
                        width: width,
                        height: height,
                        xaxis: {
                            showticklabels: true,
                            showgrid: false,
                            tickangle: 45,
                            automargin: true, // 마지막 레이블 자동으로 가리기
                            tickmode: "array", // 눈금 모드 설정
                        },
                        yaxis: {
                            showticklabels: true,
                            showgrid: false,
                            tickmode: "array", // 눈금 모드 설정
                            tickvals: tickvals, // 눈금 값 설정
                            ticktext: ticktext, // 눈금 텍스트 설정
                        },
                        margin: { l: 60, r: 40, t: 50, b: 50 },
                    }}
                    config={{ responsive: true }}
                />
            </Box>
        );
    }
};
