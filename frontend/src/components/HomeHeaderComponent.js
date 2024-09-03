import { createStyles, Header, Group, Burger, UnstyledButton, Text, useMantineTheme, Paper, Menu, Avatar } from "@mantine/core";
import { IconSearch, IconCalendarEvent, IconSettings, IconMessageCircle } from "@tabler/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

import React, { useEffect, useState } from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { IS_CHRISTMAS_ENABLED } from "../constants/genricConstants";
import NotificationComponent from "./NotificationComponent";
import HeaderLogoPartial from "../partials/HeaderLogoPartial";
import { signOut } from "../custom/Auth";
import { getUserAvatar } from "../custom/User";

const useStyles = createStyles((theme) => ({
    header: {
        ...{ paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md, zIndex: 100 },
        ...(window.location.pathname === "/" || window.location.href.includes("/anime") ? { backgroundColor: "transparent", borderBottom: 0 } : {}),
    },

    inner: {
        height: 56,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    links: {
        [theme.fn.smallerThan("md")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: "white",
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },
    navIcons: {
        cursor: "pointer",
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: 47,
        textDecoration: "none",
        color: "white",
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
        backgroundColor: "transparent",
        "&:hover": {
            color: WATCHANIME_RED,
        },
    },
    searchBarUnstyledButton: {
        padding: "0px 5px 0px 12px",
        color: "rgb(144, 146, 150)",
        backgroundColor: "rgb(37, 38, 43)",
        border: "1px solid rgb(55, 58, 64)",
        fontSize: "16px",
        height: "34px",
        borderRadius: "8px",
        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },
    searchBarText: {
        paddingRight: "80px",
    },
    searchBarShortCut: {
        fontSize: "11px",
        border: "1px solid rgb(26, 27, 30)",
        backgroundColor: "rgb(26, 27, 30)",
        padding: "4px 7px",
    },
    searchBarSearchIcon: {
        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },
    searchBarScheduleIcon: {
        ...{
            ...(window.location.pathname !== "/" ? { display: "none" } : {}),
            [theme.fn.smallerThan("xs")]: {
                display: "none",
            },
        },
    },
}));

function HomeHeaderComponent({ sideBarState, setSideBarState, otherData, setSearchModalOpen }) {
    const location = useLocation();
    const { classes } = useStyles(location);
    const theme = useMantineTheme();
    const [scrollPosition, onScrollPositionChange] = useState(false);
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
    const navigate = useNavigate();

    const executeLogout = () => {
        signOut();
        navigate("/signin");
    };

    useEffect(() => {
        const handler = () => {
            onScrollPositionChange((scrollPosition) => {
                if (!scrollPosition && (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)) {
                    return true;
                }

                if (scrollPosition && document.body.scrollTop < 4 && document.documentElement.scrollTop < 4) {
                    return false;
                }

                return scrollPosition;
            });
        };

        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.ctrlKey && event.key === "k") {
                event.preventDefault();
                // Your function to run on Ctrl + K
                setSearchModalOpen(true);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Header fixed height={56} className={classes.header} mb={120} sx={scrollPosition && { backgroundColor: "#1A1B1E", borderBottom: "1px solid #2C2E33" }}>
                <div className={classes.inner}>
                    <Group>
                        <Burger opened={sideBarState} onClick={setSideBarState} size="sm" />
                        <Link to="/">
                            <HeaderLogoPartial isChristmasEnabled={IS_CHRISTMAS_ENABLED} mobile={mobile} />
                        </Link>
                    </Group>

                    <Group>
                        <UnstyledButton onClick={(e) => setSearchModalOpen(true)} className={classes.searchBarUnstyledButton}>
                            <Group>
                                <IconSearch size={16} stroke={1.5} />
                                <Text className={classes.searchBarText}>Search</Text>
                                <Group className={classes.searchBarShortCut}>Ctrl+k</Group>
                            </Group>
                        </UnstyledButton>
                        <Group spacing={5}>
                            <Paper className={[classes.navIcons, classes.searchBarSearchIcon]} onClick={(e) => setSearchModalOpen(true)} hidden={useMediaQuery(`(min-width: ${theme.breakpoints.md})`)}>
                                <IconSearch size={20} stroke={1.5} />
                            </Paper>
                            <Paper
                                className={[classes.navIcons, classes.searchBarScheduleIcon]}
                                onClick={(event) => {
                                    event.preventDefault();
                                    otherData.executeTargetRefSchedule();
                                }}
                            >
                                <IconCalendarEvent size={22} stroke={1.5} />
                            </Paper>
                            <NotificationComponent />
                            <Menu shadow="md" width={200} position="bottom-end" transition="pop-top-right" withArrow>
                                <Menu.Target>
                                    <Paper className={[classes.navIcons, classes.searchBarAccountIcon]}>
                                        <Avatar src={getUserAvatar()} radius={"xl"} sx={{ height: "30px", width: "30px", minWidth: "30px" }} />
                                    </Paper>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Application</Menu.Label>
                                    <Menu.Item icon={<IconSettings size={14} />} onClick={(e) => navigate("/dashboard")}>
                                        Dashboard
                                    </Menu.Item>
                                    <Menu.Item icon={<IconMessageCircle size={14} />} onClick={executeLogout}>
                                        Logout
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Group>
                </div>
            </Header>
        </>
    );
}

export default HomeHeaderComponent;
