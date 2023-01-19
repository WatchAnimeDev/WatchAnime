import React, { useEffect, useState } from "react";
import { Paper, Menu, createStyles, LoadingOverlay, Text, Card, Transition, Container, Group, Avatar, Box, Indicator } from "@mantine/core";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { IconBell, IconPoint, IconSettings } from "@tabler/icons";
import { getNotificationPreviewImageFromNotificationData, getNotificationTitleFromNotificationData, getUserNotifications } from "../custom/Notifications";
import { getFormattedDateFromTimestamp } from "../custom/DateTime";

const useStyles = createStyles((theme) => ({
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
    menuDropDown: {
        width: "325px",
        minWidth: "325px",
        minHeight: "475px",
        padding: "0px",
        height: "475px",
        overflowY: "auto",
        borderRadius: "10px",
    },
    notificationTopBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 15px",
    },
    notificationCard: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px !important",
        margin: "10px !important",
        "&:hover": {
            backgroundColor: "#353738",
        },
    },
    dot: {
        height: "5px",
        width: "5px",
        backgroundColor: "#8c8484",
        borderRadius: "50%",
    },
    center: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
    },
}));

function NotificationComponent() {
    const { classes } = useStyles();
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [notificationData, setNotificationData] = useState([]);
    const [notificationDataCount, setNotificationDataCount] = useState(0);
    useEffect(() => {
        async function fetchNotificationData() {
            const notifData = await getUserNotifications();
            setNotificationData(notifData);
            setNotificationDataCount(notifData.length);
        }
        fetchNotificationData();
    }, []);

    const handleUserNotification = async (e) => {
        e.preventDefault();
        setNotificationDataCount(0);
        setIsLoading(false);
        setTimeout(() => {
            setIsMounted(true);
        }, 1);
        setNotificationData(await getUserNotifications());
    };

    return (
        <Menu
            shadow="md"
            width={200}
            position="bottom-end"
            transition="pop-top-right"
            withArrow
            onClose={() => {
                setTimeout(() => {
                    setIsLoading(true);
                }, 500);
                setIsMounted(false);
                //Enable after mark as read feature
                // setNotificationDataCount(notificationData.length);
            }}
        >
            <Menu.Target>
                <Paper
                    className={[classes.navIcons, classes.searchBarAccountIcon]}
                    onClick={(e) => {
                        handleUserNotification(e);
                    }}
                >
                    <Indicator size={15} color={WATCHANIME_RED} offset={2} label={notificationDataCount} showZero={false} dot={false}>
                        <IconBell size={22} stroke={1.5} />
                    </Indicator>
                </Paper>
            </Menu.Target>
            <Menu.Dropdown className={classes.menuDropDown}>
                <Container className={classes.notificationTopBar}>
                    <Text>Notification</Text>
                    <IconSettings size={18} stroke={1.5} />
                </Container>
                <LoadingOverlay visible={isLoading} overlayBlur={20} loaderProps={{ color: WATCHANIME_RED }} />
                {notificationData.length ? (
                    <Transition mounted={isMounted} transition="pop" duration={500} timingFunction="ease">
                        {(styles) => (
                            <div style={styles}>
                                {notificationData.map((notification, ind) => {
                                    return (
                                        <Card p="lg" radius="md" mb={"5px"} className={classes.notificationCard} key={ind}>
                                            <Box sx={{ width: "5%" }}>
                                                <IconPoint size={18} stroke={1.5} />
                                            </Box>
                                            <Container sx={{ padding: "0px", width: "85%" }} mx={"10px"}>
                                                <Text sx={{ fontSize: "14px" }}>{getNotificationTitleFromNotificationData(notification)}</Text>
                                                <Group sx={{ fontSize: "12px", color: "#7a7a7a", gap: "0px" }}>
                                                    <Text>{notification.sender}</Text>
                                                    <Box className={classes.dot} mx="5px"></Box>
                                                    <Text>{getFormattedDateFromTimestamp(notification.createdAt * 1000)}</Text>
                                                </Group>
                                            </Container>
                                            <Avatar src={getNotificationPreviewImageFromNotificationData(notification)} mx={"5px"} sx={{ width: "10%" }} />
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </Transition>
                ) : (
                    <Box className={classes.center}>All caught up!</Box>
                )}
            </Menu.Dropdown>
        </Menu>
    );
}

export default NotificationComponent;
