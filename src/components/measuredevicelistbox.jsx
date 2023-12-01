import React, { Component } from "react";

import { Box, Typography } from "@mui/material";

import styled from "@emotion/styled";

const DeviceItemBox = styled(Box)(({ isClicked }) => ({
    width: 150,
    padding: 8,
    boxSizing: "border-box",
    backgroundColor: isClicked ? "#D2E1FF" : "",
    border: "1px solid lightgray",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: 16
}));

const ConnectLampBox = styled(Box)(({ status }) => ({
    width: "15px",
    height: "15px",
    backgroundColor: status === 1 ? "green" : "gray",
    borderRadius: "50%",
}));

const LampBox = styled(Box)(({ isMeasuring }) => ({
    width: "15px",
    height: "15px",
    backgroundColor: isMeasuring ? "red" : "gray",
    borderRadius: "50%",
}));

export default class MeasureDeviceListBox extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {};
    }

    render()
    {
        const { deviceList, serialNumber, handleItemClick } = this.props;

        return (
            <Box height="100%" backgroundColor="white" overflowX="hidden" overflowY="auto">
                {
                    deviceList.map(e => (
                        <DeviceItemBox
                            key={e.sn}
                            isClicked={serialNumber === e.sn}
                            onClick={() => handleItemClick(e.sn)}
                        >
                            <Box width="100%" flexDirection="column">
                                <Box>
                                    <Typography style={{ width: "33%", flexShrink: 0, fontSize: "20px", fontWeight: 600 }}>{e.sn}</Typography>
                                </Box>
                                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography>Connect</Typography>
                                    <ConnectLampBox status={e.connectStatus}></ConnectLampBox>
                                </Box>
                                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography>Status</Typography>
                                    <ConnectLampBox status={e.measureStatus}></ConnectLampBox>
                                </Box>
                                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography>Alarm</Typography>
                                    <LampBox isMeasuring={e.status === "Measuring"}></LampBox>
                                </Box>
                            </Box>
                        </DeviceItemBox>
                    ))
                }
            </Box>
        );
    }
};