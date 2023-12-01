import React from 'react';
import Plot from 'react-plotly.js';

class DbSearchPlot extends React.Component
{
    constructor(props)
    {
        super(props);

        // 초기 데이터 설정
        this.state = {
            data: this.initializeData()
        };
    }

    initializeData()
    {
        const refs = 3;
        const linesPerRef = 4;
        const colors = ['red', 'orange', 'yellow', 'green'];
        let data = [];

        for (let i = 0; i < refs; i++)
        {
            for (let j = 0; j < linesPerRef; j++)
            {
                let lineData = {
                    x: [], // 초기 x 배열
                    y: [], // 초기 y 배열
                    mode: 'lines',
                    line: {
                        shape: 'linear',
                        color: colors[j],
                    },
                    name: `Ref${i + 1} EQ${j + 1}`,
                };
                data.push(lineData);
            }
        }
        return data;
    }

    getRandomYValue(refNum)
    {
        switch (refNum)
        {
            case 0:
                return Math.random() * 100; // 0 ~ 100
            // case 1:
            //     return 110 + Math.random() * 100; // 100 ~ 200
            // case 2:
            //     return 210 + Math.random() * 100; // 200 ~ 300
            default:
                return null;
        }
    }

    componentDidMount()
    {
        // 0.5초 간격으로 무작위 데이터 추가
        this.interval = setInterval(() =>
        {
            let updatedData = this.state.data.map((line, index) =>
            {
                let refNum = Math.floor(index / 4);
                let now = new Date();
                let newX = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                let newY = this.getRandomYValue(refNum - 1);

                let newXData = [...line.x, newX];
                let newYData = [...line.y, newY];

                // 최대 25개의 데이터 포인트만 유지
                if (newXData.length > 25)
                {
                    newXData.shift(); // 가장 오래된 데이터 제거
                }
                if (newYData.length > 25)
                {
                    newYData.shift(); // 가장 오래된 데이터 제거
                }

                return {
                    ...line,
                    x: newXData,
                    y: newYData
                };
            });

            this.setState({ data: updatedData });
        }, 1000);
    }


    componentWillUnmount()
    {
        clearInterval(this.interval);
    }

    render()
    {
        const visibleData = this.state.data.filter(line => line.x.length > 0 && line.y.length > 0);

        visibleData.forEach((line) =>
        {
            line.name = ""; // 범례 감추기
            line.showlegend = false; // 범례에서 숨기기
            line.legendgroup = "hidden"; // 동일한 그룹으로 설정하여 그룹화
        });

        return (
            <Plot
                data={visibleData}
                layout={{
                    title: "",
                    width: 1500,
                    height: 300,
                    xaxis: {
                        showticklabels: true,
                        showgrid: false,
                        tickangle: 45,
                        automargin: true, // 마지막 레이블 자동으로 가리기
                    },
                    yaxis: {
                        showticklabels: true,
                        showgrid: false,
                        tickmode: "array", // 눈금 모드 설정
                        tickvals: [0, 50, 100], // 눈금 값 설정
                        ticktext: [0, 50, 100], // 눈금 텍스트 설정
                    },
                    margin: { l: 60, r: 10, t: 20, b: 0 },
                }}
            />
        );
    }
}

export default DbSearchPlot;