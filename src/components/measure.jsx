import React, { Component, createRef, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import styled from "@emotion/styled";

import { EQ_COLORS, SCREEN_HEIGHT, SCREEN_WIDTH, SERVER_URL, TAG_LENGTH } from "../dist/global";
import { TAG_MIN1, TAG_MIN2, TAG_MAX1, TAG_MAX2 } from "../dist/global";

import MeasureDeviceListBox from "./measuredevicelistbox";
import MeasurePlot from "./measureplot";
import MeasureDialogContent from "./measuredialogcontent";
import MeasureTable from "./measuretable";

const timestampToTime = (timestamp) =>
{
    try
    {
        const date = timestamp.split(/[- :]/);
        return `${date[3]}:${date[4]}:${date[5]}`;
    }
    catch (error)
    {
        console.error(error);
    }
};

const MeasureTypography = styled(Typography)({
    fontSize: "28px",
    fontWeight: "600",
    color: "#2ab514",
});

const OptionTypography = styled(Typography)({
});

const MeasureTextField = styled(TextField)({
    width: "70px",
    mx: 5
});

const MeasureTagContainer = styled(Box)({
    display: "flex",
    alignItems: "center",
    maxWidth: "100%",
    overflow: "hidden", // 넘치는 컨텐츠를 숨기도록 설정
});

const MeasureTagTextField = styled(TextField)({
    flex: 1,
    overflow: "cover", // 넘치는 컨텐츠를 숨기도록 설정
});

const PaperComponent = ({ dialogRef, ...other }) =>
{
    const [position, setPosition] = useState({ left: 0, top: 0 });

    React.useEffect(() =>
    {
        const center = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 };
        const width = dialogRef.current.clientWidth;
        const height = dialogRef.current.clientHeight;
        setPosition({ left: center.x - (width / 2), top: center.y - (height / 2) });
    }, []);

    return <div ref={dialogRef} style={{ width: "100%", maxWidth: "1600px", position: "absolute", margin: "0px", left: position.left, top: position.top, borderRadius: "16px" }} {...other} />;
};

/**
 * constant
 */
const UPDATE_DEVICE_TIME = 1000;

export default class Measure extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            deviceList: [],
            start: false,
            serialNumber: -1,
            refs: [], // 테이블 데이터
            auto: true,
            interval: 1,
            repeat: 100,
            tagsField: { error: false, label: "", value: "" },
            refScore: {},
            openDialog: false,
            selectedItems: [] // 자식(다이얼로그 -> 테이블)에서 전달 받기 위한 배열.
        };

        this.pending = false;

        this.tasks = createRef();
        this.tasks.current = [];

        this.dialogRef = createRef();

        this.updateDeviceTimer = -1;
        this.updateScoreTimer = -1;
    };

    componentDidMount = async () =>
    {
        await this.fetchDeviceMeasure();
        this.startUpdateDevice(true);
    };

    componentWillUnmount = () =>
    {
        this.stopUpdateDevice();
        this.stopUpdateScore();
    };

    /**
     * handler
     */
    handleClickDevice = (selectedSerialNumber) =>
    {
        this.saveTask();
        this.loadTask(selectedSerialNumber);
    };

    handleUpdateRefs = (refs) =>
    {
        this.setState({ refs: refs });
    };

    handleChangeAuto = (event) =>
    {
        this.setState({ auto: event.target.checked });
    };

    handleChangeInterval = (event) =>
    {
        const onlyNums = event.target.value.replace(/[^0-9]/g, "");
        if (onlyNums.length > 3) // @@ max 999?
        {
            return;
        }

        this.setState({ interval: onlyNums });
    };

    handleChangeRepeat = (event) =>
    {
        const onlyNums = event.target.value.replace(/[^0-9]/g, "");
        if (onlyNums.length > 4) // @@
        {
            return;
        }

        this.setState({ repeat: onlyNums });
    };

    handleChangeTagInput = (event) =>
    {
        const onlyNums = event.target.value.replace(/[^0-9|,]/g, "");

        if (onlyNums.length > TAG_LENGTH)
        {
            return;
        }

        this.setState({ tagsField: this.checkTags(onlyNums) });
    };

    handleClickStart = (event) =>
    {
        const { serialNumber, refs, auto, interval, repeat, tagsField } = this.state;

        for (const e of refs)
        {
            const { id, eq } = e;
            if (eq.length === 0)
            {
                console.log(`${id} EQ를 1개 이상 선택해주세요.`);
                return;
            }
        }

        if (Number(interval) < 1)
        {
            console.log("시간을 1초 이상 입력 하세요.");
            return;
        }

        if (auto && Number(repeat) < 1)
        {
            console.log("반복을 1회 이상 입력 하세요.");
            return;
        }

        const newRepeat = auto ? repeat : 1;

        const body = {
            sn: serialNumber,
            refs: refs,
            auto: auto,
            interval: interval,
            repeat: newRepeat,
            tags: [tagsField.value]
        };

        if (this.pending)
        {
            return;
        }

        this.pending = true;

        fetch(`${SERVER_URL}/measure-start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((json) =>
            {
                const { success, message, data } = json;

                if (success === "OK")
                {
                    const { sn, measureId } = data;

                    this.updateTaskMeasureId(sn, measureId);

                    this.startUpdateScore();

                    this.setState({ start: true, });
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

    handleClickStop = () =>
    {
        const { serialNumber } = this.state;

        if (this.pending)
        {
            return;
        }

        this.pending = true;

        fetch(`${SERVER_URL}/measure-stop`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sn: serialNumber })
        })
            .then((response) => response.json())
            .then((json) =>
            {
                const { success, message } = json;

                if (success === "OK")
                {
                    this.stopUpdateScore();
                    this.setState({ start: false });
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

    handleDialogOpen = () =>
    {
        const { refs } = this.state;
        const selectedItems = [...refs];
        this.setState({ openDialog: true, selectedItems: selectedItems });
    };

    handleClickOk = () =>
    {
        const { serialNumber, refs, selectedItems } = this.state;

        const selectedTask = this.getSelectedTask(serialNumber);
        if (selectedTask)
        {
            const newRefs = selectedItems.map(selectedItem =>
            {
                let find = false;
                for (const ref of refs)
                {
                    if (selectedItem.id === ref.id)
                    {
                        find = true;
                        break;
                    }
                }

                if (find)
                {
                    return selectedItem;
                }
                else
                {
                    return {
                        visible: true,
                        id: selectedItem.id,
                        timestamp: selectedItem.timestamp,
                        tags: selectedItem.tags,
                        inv: false,
                        min: "",
                        max: "",
                        score: selectedItem.score,
                        eq: ["EQ1"],
                        del: "",
                    };
                }
            });

            this.setState({ openDialog: false, refs: newRefs, selectedItems: [] });
        }
    };

    handleClickCancel = () =>
    {
        this.setState({ openDialog: false, selectedItems: [] });
    };

    handleSelectedItems = (newSelectedItems) =>
    {
        this.setState({ selectedItems: newSelectedItems });
    };

    /**
     * fetch
     */
    fetchUpdateDevice = async () =>
    {
        if (this.pending) 
        {
            return;
        }

        this.pending = true;

        try
        {
            const response = await fetch(`${SERVER_URL}/device`, {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json",
                },
            });

            const json = await response.json();
            const { success, message, data } = json;

            if (success === "OK")
            {
                const { deviceList } = this.state;

                const newDeviceList = data.map(e => ({
                    sn: e.sn,
                    connectStatus: e.connect_status,
                    measureStatus: e.measure_status,
                    mi: e.mi,
                }));

                if (JSON.stringify(deviceList) !== JSON.stringify(newDeviceList)) // render 를 줄이기 위해
                {
                    this.setState({ deviceList: newDeviceList });
                }
            }
            else
            {
                console.log(message);
            }
        }
        catch (error)
        {
            throw new Error(error);
        }
        finally 
        {
            this.pending = false;
        }
    };

    fetchUpdateScore = async () =>
    {
        const { serialNumber } = this.state;
        const selectedTask = this.getSelectedTask(serialNumber);
        if (selectedTask === null)
        {
            return;
        }

        const { measureId } = selectedTask;

        const body = {
            sn: serialNumber,
            measureId: measureId,
        };

        if (this.pending)
        {
            return;
        }

        this.pending = true;

        let end = false;

        await fetch(`${SERVER_URL}/measure-score`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((json) =>
            {
                const { success, message, data } = json;

                if (success === "OK")
                {
                    let refScore = {};

                    for (const e of data)
                    {
                        const time = timestampToTime(e.timestamp);
                        const score = JSON.parse(e.score);

                        for (const s of score)
                        {
                            const { id, values } = s;

                            if (!refScore[id])
                            {
                                refScore[id] = {};
                            }

                            for (const v of values)
                            {
                                const { eq, value } = v;

                                if (refScore[id][eq])
                                {
                                    const { x, y } = refScore[id][eq];
                                    x.push(time);
                                    y.push(value);
                                }
                                else
                                {
                                    refScore[id][eq] = {
                                        name: `${id}_${eq}`,
                                        type: "scatter",
                                        mode: "lines",
                                        x: [time],
                                        y: [value],
                                        line: { shape: "linear", color: EQ_COLORS[eq] },
                                        showlegend: false,
                                        legendgroup: "hidden"
                                    };
                                }
                            }
                        }
                    }

                    if (message) // end
                    {
                        end = true;
                        this.setState({ start: false, refScore: refScore });
                    }
                    else
                    {
                        this.setState({ refScore: refScore });
                    }
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

        return end;
    };

    fetchDeviceMeasure = async () =>
    {
        if (this.pending) 
        {
            return;
        }

        this.pending = true;

        await fetch(`${SERVER_URL}/device-measure`, {
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
                    this.tasks.current = data.map(e => ({
                        serialNumber: e.sn,
                        status: e.measure_status === 1 ? true : false,
                        measureId: e.measure_id,
                        refs: JSON.parse(e.measure_refs),
                        auto: e.measure_auto === 1 ? true : false,
                        interval: e.measure_interval,
                        repeat: e.measure_repeat,
                        tagsField: this.checkTags(JSON.parse(e.measure_tags).toString()),
                        refScore: {},
                        count: e.measure_count
                    }));
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

    /**
     * normal
     */

    startUpdateDevice = async (first = false) =>
    {
        if (first && this.updateDeviceTimer !== -1) // 중복 실행 방지
        {
            return;
        }

        this.updateDeviceTimer = setTimeout(async () =>
        {
            try
            {
                await this.fetchUpdateDevice();
                this.startUpdateDevice(); // 재귀
            }
            catch (error)
            {
                console.error(error);
            }
        }, first ? 0 : UPDATE_DEVICE_TIME);
    };

    stopUpdateDevice = () =>
    {
        clearTimeout(this.updateDeviceTimer);
        this.updateDeviceTimer = -1;
    };

    startUpdateScore = async () =>
    {
        this.stopUpdateScore();
        this._startUpdateScore();
    };

    _startUpdateScore = async () =>
    {
        this.updateScoreTimer = setTimeout(async () =>
        {
            try
            {
                const end = await this.fetchUpdateScore();
                if (end)
                {
                    return;
                }

                this._startUpdateScore(); // 재귀
            }
            catch (error)
            {
                console.error(error);
            }
        }, UPDATE_DEVICE_TIME);
    };

    stopUpdateScore = () =>
    {
        clearTimeout(this.updateScoreTimer);
        this.updateScoreTimer = -1;
    };

    checkTags = (value) =>
    {
        let error = false;
        if (value !== "")
        {
            const nums = value.split(",");

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
        return { error: error, label: error ? `${TAG_MIN1} ~ ${TAG_MAX1} 또는 ${TAG_MIN2} ~ ${TAG_MAX2} 로 입력해 주세요.` : "", value: value };
    };

    getSelectedTask = (serialNumber) =>
    {
        if (serialNumber === -1)
        {
            return null;
        }

        let selectedTask = null;
        for (const e of this.tasks.current)
        {
            if (e.serialNumber === serialNumber)
            {
                selectedTask = e;
                break;
            }
        }
        return selectedTask;
    };

    loadTask = (serialNumber) =>
    {
        const selectedTask = this.getSelectedTask(serialNumber);
        if (selectedTask)
        {
            const { status, refScore } = selectedTask;
            if (status)
            {
                this.startUpdateScore();
            }

            this.setState({ ...selectedTask, serialNumber: serialNumber, start: status, refScore: refScore });
        }
    };

    saveTask = () =>
    {
        const { serialNumber, start, refs, auto, interval, repeat, tagsField, refScore } = this.state;

        const selectedTask = this.getSelectedTask(serialNumber);
        if (selectedTask === null)
        {
            return;
        }

        this.stopUpdateScore();

        const task = { ...selectedTask, serialNumber: serialNumber, status: start, refs: refs, auto: auto, interval: interval, repeat: repeat, tagsField: tagsField, refScore: refScore };

        for (const [i, e] of this.tasks.current.entries())
        {
            if (e.serialNumber === serialNumber)
            {
                this.tasks.current.splice(i, 1, task);
                return true;
            }
        }
        return false;
    };

    updateTaskMeasureId = (serialNumber, measureId) =>
    {
        for (const [i, e] of this.tasks.current.entries())
        {
            if (e.serialNumber === serialNumber)
            {
                const newTask = { ...e, measureId: measureId, status: true };
                this.tasks.current.splice(i, 1, newTask);
                return true;
            }
        }
        return false;
    };

    render()
    {
        const { deviceList, start, serialNumber, refs, auto, interval, repeat, tagsField, selectedItems, refScore } = this.state;

        return (
            <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
                <MeasureDeviceListBox deviceList={deviceList} serialNumber={serialNumber} handleItemClick={this.handleClickDevice}></MeasureDeviceListBox>
                {serialNumber !== -1 ? (
                    <Box container sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", boxSizing: "border-box", marginLeft: "24px", padding: "16px", border: "1px solid lightgray", borderRadius: "16px" }}>
                        <MeasureTypography>{serialNumber}</MeasureTypography>
                        <Box width="100%" display="flex" sx={{ '& > :not(style)': { ml: 1, mt: 0 } }}>
                            <Fab
                                disabled={start}
                                color="white"
                                aria-label="add"
                                onClick={this.handleDialogOpen}
                                sx={{ width: "35px", height: "15px", position: "absolute", top: 165 }}
                            >
                                <AddIcon />
                            </Fab>
                        </Box>
                        <MeasureTable start={start} refs={refs} handleUpdate={this.handleUpdateRefs}></MeasureTable>
                        <Box sx={{ display: "flex", flexDirection: "row", width: "100%", marginTop: "8px", alignItems: "center" }}>
                            <FormControlLabel disabled={start} control={<Checkbox checked={auto} onChange={this.handleChangeAuto} />} label="Auto" />
                            <OptionTypography mr={2}>Interval(sec)</OptionTypography>
                            <MeasureTextField size="small" value={interval} disabled={start} onChange={this.handleChangeInterval} />
                            <OptionTypography mx={2}>Repeat</OptionTypography>
                            <MeasureTextField size="small" value={repeat} disabled={start || auto === false} onChange={this.handleChangeRepeat} />
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", width: "100%", marginTop: "8px", alignItems: "center" }}>
                            <OptionTypography mx={1}>Tags</OptionTypography>
                            <MeasureTagContainer width="100%" height={52}>
                                <MeasureTagTextField
                                    size="small"
                                    disabled={start}
                                    type="text"
                                    error={tagsField.error}
                                    label={tagsField.label}
                                    value={tagsField.value}
                                    placeholder="1000,1001"
                                    onChange={this.handleChangeTagInput}
                                />
                            </MeasureTagContainer>
                            <Box display="flex" justifyContent="flex-end" ml="8px">
                                <Button variant="contained" disabled={start} onClick={this.handleClickStart}>Start</Button>
                                <Button sx={{ marginLeft: "8px" }} variant="contained" disabled={!start} onClick={this.handleClickStop}>Stop</Button>
                            </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>{/* 메뉴가 있어 마진 제거 */}
                            <MeasurePlot refs={refs} refScore={refScore}></MeasurePlot>
                        </Box>
                    </Box >
                ) : null}
                <Dialog PaperProps={{ component: PaperComponent, dialogRef: this.dialogRef }} open={this.state.openDialog} onClose={this.handleClickCancel}>
                    <DialogContent>
                        <MeasureDialogContent serialNumber={serialNumber} selectedItems={selectedItems} onClose={this.handleClickCancel} handleSelectedItems={this.handleSelectedItems} />
                    </DialogContent>
                    <DialogActions sx={{ paddingX: "24px", paddingTop: "0px", paddingBottom: "20px" }}>
                        <Button variant="contained" onClick={this.handleClickOk}>확인</Button>
                        <Button variant="contained" onClick={this.handleClickCancel}>취소</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
}