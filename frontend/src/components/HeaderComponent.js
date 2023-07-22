import { createStyles, Header, Group, Burger, Image, UnstyledButton, Text, useMantineTheme, Paper, Menu, Avatar } from "@mantine/core";
import { IconSearch, IconCalendarEvent, IconSettings, IconMessageCircle } from "@tabler/icons";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

import React, { useEffect, useState } from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { useSpotlight } from "@mantine/spotlight";
import { STATIC_BUCKET_URL } from "../constants/genricConstants";
import NotificationComponent from "./NotificationComponent";

const useStyles = createStyles((theme) => ({
    header: {
        ...{ paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md },
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
    searchBarAccountIcon: {
        [theme.fn.smallerThan("xs")]: {
            display: "none",
        },
    },
    searchBarSearchIcon: {
        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },
    searchBarScheduleIcon: {
        ...{ ...(window.location.pathname !== "/" ? { display: "none" } : {}) },
    },
}));

function HeaderComponent({ sideBarState, setSideBarState, otherData }) {
    const location = useLocation();
    const { classes } = useStyles(location);
    const spotlight = useSpotlight();
    const theme = useMantineTheme();
    const [scrollPosition, onScrollPositionChange] = useState(false);
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

    const handleSpotLightClick = (e) => {
        e.preventDefault();
        spotlight.openSpotlight();
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

    return (
        <>
            <Header fixed height={56} className={classes.header} mb={120} sx={scrollPosition && { backgroundColor: "#1A1B1E", borderBottom: "1px solid #2C2E33", zIndex: 100 }}>
                <div className={classes.inner}>
                    <Group>
                        <Burger opened={sideBarState} onClick={setSideBarState} size="sm" />
                        <Link to="/">
                            <Image src="https://d33wubrfki0l68.cloudfront.net/9410fce5c5c19ee15bf2b5e4872391aad38a6981/8f410/assets/logo/watchanime-logo-w-christ.png" width={mobile ? 150 : 200} />
                        </Link>
                    </Group>

                    <Group>
                        <UnstyledButton onClick={handleSpotLightClick} className={classes.searchBarUnstyledButton}>
                            <Group>
                                <IconSearch size={16} stroke={1.5} />
                                <Text className={classes.searchBarText}>Search</Text>
                                <Group className={classes.searchBarShortCut}>Ctrl+k</Group>
                            </Group>
                        </UnstyledButton>
                        <Group spacing={5}>
                            <Paper className={[classes.navIcons, classes.searchBarSearchIcon]} onClick={handleSpotLightClick} hidden={useMediaQuery(`(min-width: ${theme.breakpoints.md})`)}>
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
                                        <Avatar src={`${STATIC_BUCKET_URL}/killua.jpg`} radius={"xl"} sx={{ height: "30px", width: "30px", minWidth: "30px" }} />
                                    </Paper>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>Application</Menu.Label>
                                    <Menu.Item icon={<IconSettings size={14} />}>Stuff</Menu.Item>
                                    <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Group>
                </div>
            </Header>
        </>
    );
}

export default HeaderComponent;
