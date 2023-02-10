import React, { useEffect, useState } from "react";
import { Paper, Menu, createStyles, LoadingOverlay, Text, Card, Transition, Container, Group, Avatar, Box, Indicator, Tooltip, UnstyledButton } from "@mantine/core";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { IconBell, IconEyeCheck, IconSettings } from "@tabler/icons";
import { dismissNotification, generateNotificationCss, getNotificationPreviewImageFromNotificationData, getNotificationTitleFromNotificationData, getUserNotifications, handleNotificationClick } from "../custom/Notifications";
import { getFormattedDateFromTimestamp } from "../custom/DateTime";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { showGenericCheckBoxNotification } from "../custom/Notification";

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
        margin: "5px",
        padding: "5px 0px",
        "&:hover": {
            backgroundColor: "#353738",
            borderRadius: "5px",
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
    notificationCardParent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px !important",
        margin: "0px 5px !important",
    },
}));

function NotificationComponent() {
    const { classes } = useStyles();
    const [opened, setOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [notificationData, setNotificationData] = useState([]);
    const [notificationDataCount, setNotificationDataCount] = useState(0);

    const isMobileView = useMediaQuery("(min-width: 430px)");

    const navigate = useNavigate();

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
        setNotificationData(await getUserNotifications());
        setOpened(true);
        setNotificationDataCount(0);
        setIsLoading(false);
        setTimeout(() => {
            setIsMounted(true);
        }, 1);
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
            opened={opened}
            onChange={setOpened}
        >
            <Menu.Target>
                {isMobileView ? (
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
                ) : (
                    <Paper></Paper>
                )}
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
                                        <Card p="lg" radius="md" key={ind} sx={classes.notificationCardParent}>
                                            <Box
                                                sx={{ width: "5%" }}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await dismissNotification(notification.usernotifstatusid);
                                                    const notifData = await getUserNotifications();
                                                    setNotificationData(notifData);
                                                    showGenericCheckBoxNotification("Notificaton dismissed!", `Your notification has been dismissed successfully.`);
                                                }}
                                            >
                                                <Tooltip label="Dismiss">
                                                    <UnstyledButton>
                                                        <IconEyeCheck size={18} stroke={1.5} />
                                                    </UnstyledButton>
                                                </Tooltip>
                                            </Box>
                                            <Box
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNotificationClick(notification, navigate);
                                                    setOpened(false);
                                                }}
                                                className={classes.notificationCard}
                                                sx={generateNotificationCss(notification)}
                                            >
                                                <Container sx={{ padding: "0px", width: "85%" }} mx={"10px"}>
                                                    <Text sx={{ fontSize: "14px" }}>{getNotificationTitleFromNotificationData(notification)}</Text>
                                                    <Group sx={{ fontSize: "12px", color: "#7a7a7a", gap: "0px" }}>
                                                        <Text>{notification.sender}</Text>
                                                        <Box className={classes.dot} mx="5px"></Box>
                                                        <Text>{getFormattedDateFromTimestamp(notification.createdAt * 1000)}</Text>
                                                    </Group>
                                                </Container>
                                                <Avatar src={getNotificationPreviewImageFromNotificationData(notification)} mr={"10px"} sx={{ width: "10%" }} />
                                            </Box>
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
