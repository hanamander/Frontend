/* React */
import React, { Component } from "react";

/* React Material-ui */
import { Box, Typography, Button, TextField } from "@mui/material";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import styled from "@emotion/styled";

import Main from "./main";
import IrisConfigs from "./irisconfigs";
import Measure from "./measure";
import DbSearchc from "./dbsearchc";
import DataDetails from "./datadetails";
import { SCREEN_HEIGHT, SCREEN_WIDTH, MAIN_PADDING, SERVER_URL } from "../dist/global";

const NAVI_WIDTH = 180;
const CONTENT_WIDTH = SCREEN_WIDTH - NAVI_WIDTH - MAIN_PADDING * 2;
const TITLE_HEIGHT = 60;
const CONTENT_HEIGHT = SCREEN_HEIGHT - TITLE_HEIGHT - MAIN_PADDING * 2;

const MainBox = styled(Box)({
    width: `${SCREEN_WIDTH}px`,
    height: `${SCREEN_HEIGHT}px`,
    padding: `${MAIN_PADDING}px`,
    boxSizing: "border-box",
    backgroundColor: "black",
});

const TopContainerBox = styled(Box)({
    position: "relative",
    display: "flex",
    width: "100%",
});

const MainLayoutBox = styled(Box)({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
});

const NaviBox = styled(Box)({
    width: `${NAVI_WIDTH}px`,
    height: "100%",
    backgroundColor: "#3a466c",
    borderRadius: "0px 0px 0px 10px",
    display: "flex",
    flexDirection: "column",
});

const LayoutTopBox = styled(Box)({
    width: `${CONTENT_WIDTH}px`,
    height: `${TITLE_HEIGHT}px`,
    backgroundColor: "#5874c8",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0px 10px 0px 0px",
});

const LoginInfoBox = styled(({ isExpanded, ...props }) => <Box {...props} />)(({ isExpanded }) => ({
    position: "absolute",
    top: 0,
    right: 0,
    width: `${NAVI_WIDTH}px`,
    height: isExpanded ? '150px' : '60px',
    backgroundColor: "#288CD2",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0px 10px 0px 0px",
    transition: "height 0.3s",
    zIndex: 1000,
}));

const LoginTextField = styled(TextField)({
    "& input": {
        color: "white",
    },
    "& .MuiInputLabel-root": {
        color: "white",
    },
});

const Contentbox = styled(Box)({
    width: `${CONTENT_WIDTH}px`,
    height: `${CONTENT_HEIGHT}px`,
    backgroundColor: "white",
    borderRadius: "0px 0px 10px 0px",
});

const LogoBox = styled(Box)({
    width: `${NAVI_WIDTH}px`,
    height: `${TITLE_HEIGHT}px`,
    backgroundColor: "white",
    borderRadius: "10px 0px 0px 0px",
});

const CustomTab = styled(Tab)({
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    '&:hover': {
        backgroundColor: "transparent",
    },
});

const ZoomBox = styled(Box)({
    transform: 'scale(1.5)',
    opacity: 0,
    transition: 'transform 1.5s, opacity 1.5s',
    '&.zoom-in': {
        transform: 'scale(1)',
        opacity: 1,
    },
});

class TabPanel extends Component
{
    render()
    {
        const { children, value = 0, index = 0, ...other } = this.props;

        return (
            <div
                style={{ width: "100%", height: "100%" }}
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ boxSizing: "border-box", p: "24px", width: "100%", height: "100%" }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index)
{
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default class Layout extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            value: 0,
            isexpanded: false,
            showTextFieldAndButton: false,
            password: "",
            anchorEl: null,
            header: [],
            rows: {},
        };

        this.pending = false;
        this.loginInfoBoxRef = React.createRef();

        this.signTimer = -1;
        this.signMaster = false; // global
        this.signElapsed = false;
    }

    async componentDidMount()
    {
        const { signin, elapsed, error } = await this.checkSignin();

        if (error)
        {
            return;
        }

        this.signMaster = signin;
        this.signElapsed = elapsed;

        if (signin)
        {
            this.setState({ value: 0 });
            this.checkSigninTimeLoop();
        }
    }

    handleClick = (event) =>
    {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () =>
    {
        this.setState({ anchorEl: null });
    };

    checkSigninTimeLoop = () =>
    {
        if (this.signTimer === -1)
        {
            this.signTimer = setTimeout(async () =>
            {
                const { signin, elapsed, error } = await this.checkSignin();
                if (error)
                {
                    return;
                }

                this.signMaster = signin;
                this.signElapsed = elapsed;

                if (signin === true)
                {
                    if (elapsed === true)
                    {
                        // signout & 이동
                        this.setState({ value: 0 });
                        this.checkSignout();
                        return;
                    }
                }

                this.signTimer = -1;
                this.checkSigninTimeLoop();
            }, 1000);
        }
    };

    checkSignin = async () =>
    {
        return await fetch(`${SERVER_URL}/sign-available`, {
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
                    return { ...data, error: false };
                }
                else
                {
                    return { error: true, message: message };
                }
            })
            .catch((error) =>
            {
                return { error: true, message: error };
            })
    };

    checkSignout = async () =>
    {
        if (this.pending)
        {
            return;
        }

        this.pending = true;

        try
        {
            const response = await fetch(`${SERVER_URL}/sign-out`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json = await response.json();

            if (response.ok)
            {
                const { success } = json;

                if (success === "OK")
                {
                    this.signMaster = false;

                    this.setState({
                        isexpanded: false,
                        password: "",
                        value: 0,
                    });
                }
            }
        }
        catch (error)
        {
            console.error(error);
            return {
                success: false,
                error: true,
                message: "An error occurred during sign out.",
            };
        }
        finally
        {
            this.pending = false;
        }
    };

    handleChange = async (event, newValue) =>
    {
        this.setState({ value: newValue });
    };

    handleLoginInfoClick = () =>
    {
        this.setState((prevState) => ({ isexpanded: !prevState.isexpanded, }), () =>
        {
            const { isexpanded, value } = this.state;
            const newValue = this.signMaster === false ? 0 : value;

            if (isexpanded)
            {
                setTimeout(() =>
                {
                    this.setState({ showTextFieldAndButton: true, value: newValue });
                }, 400);
            }
            else
            {
                this.setState({ showTextFieldAndButton: false, value: newValue });
            }
        });
    };

    handleLogin = () =>
    {
        if (this.pending)
        {
            return;
        }

        this.pending = true;

        const { password } = this.state;

        //if (password === "")//hanam
        //    return;
        //{
        //    console.log("return");
        //}

        fetch(`${SERVER_URL}/sign-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
            
        })
            .then((response) => response.json())
            .then((json) =>
            {
                const { success, message } = json;

                if (success === "OK")
                {
                    this.signMaster = true;
                    this.setState({ isExpanded: false });
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

    handleChangePassword = (event) =>
    {
        this.setState({ password: event.target.value });
    };

    render()
    {
        const { value, password } = this.state;
        const loggedIn = this.signMaster; // 로그인 상태 여부

        return (
            <MainBox>
                <MainLayoutBox>
                    <Box display="flex">
                        <TopContainerBox>
                            <LogoBox sx={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <img style={{ width: "100px", height: "50px", padding: 16, }} src={process.env.PUBLIC_URL + "/assets/image/aether_logo.png"} alt="Logo" />
                            </LogoBox>
                            <LayoutTopBox>
                                <Typography sx={{ fontSize: "30px", fontWeight: "700" }}>IRIS WEB INTERFACE</Typography>
                            </LayoutTopBox>
                            <LoginInfoBox
                                ref={this.loginInfoBoxRef}
                                isexpanded={this.state.isexpanded}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{
                                        flexDirection: "row",
                                        position: "absolute",
                                        top: 30,
                                        right: -60,
                                        width: "100%",
                                        borderRadius: "0px 10px 0px 0px",
                                    }}
                                >
                                    <Typography isexpanded={this.state.isexpanded} onClick={this.handleLoginInfoClick} sx={{ position: "absolute", fontSize: 20 }}>
                                        {loggedIn ? "Master" : "User"}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        sx={{ position: "absolute", right: 70, color: "white" }}
                                        isexpanded={this.state.isexpanded}
                                        onClick={this.handleLoginInfoClick}
                                    >
                                        {this.state.isexpanded ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </Box>
                                {this.state.isexpanded && this.state.showTextFieldAndButton && (
                                    <ZoomBox mt={5} className="zoom-in" display="flex" flexDirection="column">
                                        {!loggedIn ? (
                                            // 로그인 상태가 아닐 때 로그인 버튼을 표시
                                            <>
                                                <LoginTextField
                                                    type="password"
                                                    autoComplete="off"
                                                    placeholder="KEY"
                                                    size="small"
                                                    margin="dense"
                                                    value={password}
                                                    onChange={this.handleChangePassword}
                                                    sx={{ width: 150 }}
                                                />
                                                <Button variant="contained" color="secondary" sx={{ minWidth: 150 }} onClick={this.handleLogin}>
                                                    Log in
                                                </Button>
                                            </>
                                        ) : (
                                            // 로그인 상태일 때 로그아웃 버튼을 표시
                                            <Button variant="contained" color="secondary" sx={{ minWidth: 150 }} onClick={this.checkSignout}>
                                                Log out
                                            </Button>
                                        )}
                                    </ZoomBox>
                                )}
                            </LoginInfoBox>
                        </TopContainerBox>
                    </Box>
                    <Box sx={{ height: "100%", display: "flex" }}>
                        <NaviBox>
                            <Tabs
                                sx={{ borderRight: 1, borderColor: "divider", marginTop: 5, fontWeight: "bold" }}
                                orientation="vertical"
                                variant="scrollable"
                                value={value}
                                onChange={this.handleChange}
                                aria-label="Vertical tabs example"
                                TabIndicatorProps={{ sx: { backgroundColor: "#ffeb3b" } }}
                            >
                                <CustomTab default label="Operation" {...a11yProps(0)} />
                                <CustomTab label="Measure" {...a11yProps(1)} />
                                <CustomTab label="DB Search" {...a11yProps(2)} />
                                <CustomTab label="Configs" {...a11yProps(3)} />
                                {loggedIn && (
                                    <CustomTab label="Data Details" {...a11yProps(4)} />
                                )}
                            </Tabs>
                        </NaviBox>
                        <Contentbox>
                            <TabPanel default value={value} index={0}>
                                <Main />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Measure />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <DbSearchc />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <IrisConfigs />
                            </TabPanel>
                            {loggedIn && (
                                <TabPanel value={value} index={4}>
                                    <DataDetails />
                                </TabPanel>
                            )}
                        </Contentbox>
                    </Box>
                </MainLayoutBox>
            </MainBox >
        );
    }
};