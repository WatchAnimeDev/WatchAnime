import { Avatar, Box, Card, Container, Group, Loader, Pagination, Text, createStyles } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { getFormattedDateFromTimestamp } from "../custom/DateTime";
import { generateNotificationCss, getNotificationPreviewImageFromNotificationData, getNotificationTitleFromNotificationData, getUserNotifications, handleNotificationClick } from "../custom/Notifications";
import { useShallow } from "zustand/react/shallow";
import { useLanguageStore } from "../store/LanguageToggleStore";
import { getUidForLoggedInUser } from "../custom/Auth";
import { useNavigate } from "react-router-dom";
import InformationPikachuPartial from "../partials/InformationPikachuPartial";
import { WATCHANIME_RED } from "../constants/cssConstants";

const useStyles = createStyles((theme) => ({
    notificationCardParent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px !important",
        margin: "0px 5px !important",
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
}));

function DashboardNotificationLayout() {
    const { classes } = useStyles();
    const [notificationData, setNotificationData] = useState([]);
    const [notificationDataPageInfo, setNotificationDataPageInfo] = useState({});
    const [page, setPage] = useState(1);
    const [ajaxComplete, setAjaxComplete] = useState(false);
    const { language } = useLanguageStore(useShallow((state) => ({ language: state.language })));
    const { navigate } = useNavigate();

    useEffect(() => {
        async function fetchNotificationData() {
            const { fetchedNotificationData, fetchedNotificationDataPageInfo } = await getUserNotifications({ userId: getUidForLoggedInUser(), page: page, pageSize: 25, includeDissmissed: true, excludeAnnouncements: true }, true);
            setNotificationData(fetchedNotificationData);
            setNotificationDataPageInfo(fetchedNotificationDataPageInfo);
            setAjaxComplete(true);
        }
        setAjaxComplete(false);
        fetchNotificationData();
    }, [page]);

    return (
        <Group w={"100%"} h={"100%"} sx={{ justifyContent: "center", alignItems: "center" }}>
            {ajaxComplete ? (
                notificationData.length ? (
                    <Group sx={{ justifyContent: "center", alignItems: "center" }}>
                        {notificationData.map((notification, ind) => (
                            <Card p="lg" radius="md" key={ind} sx={classes.notificationCardParent} w={"100%"}>
                                <Box
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNotificationClick(notification, navigate);
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
                                    <Avatar src={getNotificationPreviewImageFromNotificationData(notification, language)} mr={"10px"} sx={{ width: "10%", maxWidth: "60px" }} />
                                </Box>
                            </Card>
                        ))}
                        <Group sx={{ marginTop: "20px" }}>
                            <Pagination
                                page={page}
                                onChange={setPage}
                                total={notificationDataPageInfo.lastPage}
                                styles={(theme) => ({
                                    item: {
                                        "&[data-active]": {
                                            backgroundColor: WATCHANIME_RED,
                                        },
                                    },
                                })}
                            />
                        </Group>
                    </Group>
                ) : (
                    <InformationPikachuPartial message={"No Notifications"} subMessage={"(┬┬﹏┬┬)"} />
                )
            ) : (
                <Loader />
            )}
        </Group>
    );
}

export default DashboardNotificationLayout;
