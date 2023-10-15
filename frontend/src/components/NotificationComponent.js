import React, { useEffect, useState } from "react";
import { Paper, Menu, createStyles, LoadingOverlay, Text, Card, Transition, Container, Group, Avatar, Box, Indicator, Tooltip, UnstyledButton } from "@mantine/core";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { IconBell, IconChecks, IconEyeCheck, IconPoint, IconSettings } from "@tabler/icons";
import { dismissNotification, generateNotificationCss, getNotificationPreviewImageFromNotificationData, getNotificationTitleFromNotificationData, getUserNotificationCount, getUserNotifications, handleNotificationClick } from "../custom/Notifications";
import { getFormattedDateFromTimestamp } from "../custom/DateTime";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { dismissGenericDynamicNotification, showGenericDynamicNotification } from "../custom/Notification";
import { uuidv4 } from "../custom/User";

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
        width: "100%",
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
    notificationCardParentIcon: {
        display: "flex",
        alignItems: "center",
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
            const notifDataCount = await getUserNotificationCount();
            setNotificationDataCount(notifDataCount);
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

    const handleUserNotificationDismiss = async (e, notification = { usernotifstatusid: null }) => {
        e.preventDefault();
        const notificationId = uuidv4();
        showGenericDynamicNotification(notificationId, "Processing request!", "Dismissing your notification. Please wait!");
        await dismissNotification(notification.usernotifstatusid);
        const notifData = await getUserNotifications();
        setNotificationData(notifData);
        dismissGenericDynamicNotification(notificationId, "Notificaton dismissed!", "Your notification has been dismissed successfully.");
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
                }, 1);
                setIsMounted(false);
                //Enable after mark as read feature
                // setNotificationDataCount(notificationData.length);
            }}
            opened={opened}
            onChange={setOpened}
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
                    <Box sx={{ display: "flex", gap: "5px" }}>
                        <Tooltip label="Dismiss all notifiation">
                            <UnstyledButton
                                className={classes.notificationCardParentIcon}
                                onClick={async (e) => {
                                    handleUserNotificationDismiss(e);
                                }}
                            >
                                <IconChecks size={18} stroke={1.5} />
                            </UnstyledButton>
                        </Tooltip>
                        <Tooltip label="Notification settings">
                            <UnstyledButton className={classes.notificationCardParentIcon}>
                                <IconSettings size={18} stroke={1.5} />
                            </UnstyledButton>
                        </Tooltip>
                    </Box>
                </Container>
                <LoadingOverlay visible={isLoading} overlayBlur={20} loaderProps={{ color: WATCHANIME_RED }} />
                {notificationData.length ? (
                    <Transition mounted={isMounted} transition="pop" duration={500} timingFunction="ease">
                        {(styles) => (
                            <div style={styles}>
                                {notificationData.map((notification, ind) => {
                                    return (
                                        <Card p="lg" radius="md" key={ind} sx={classes.notificationCardParent}>
                                            {notification.notif_type === 0 ? (
                                                <Box sx={{ width: "5%" }}>
                                                    <UnstyledButton sx={{ pointerEvents: "none" }}>
                                                        <IconPoint size={18} stroke={1.5} />
                                                    </UnstyledButton>
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{ width: "5%" }}
                                                    onClick={async (e) => {
                                                        handleUserNotificationDismiss(e, notification);
                                                    }}
                                                >
                                                    <Tooltip label="Dismiss notification">
                                                        <UnstyledButton>
                                                            <IconEyeCheck size={18} stroke={1.5} />
                                                        </UnstyledButton>
                                                    </Tooltip>
                                                </Box>
                                            )}

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
