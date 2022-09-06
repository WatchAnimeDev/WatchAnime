import { Alert, Button, Dialog, Group, Text, TextInput } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconCircleX } from "@tabler/icons";
import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { API_BASE_URL } from "../constants/genricConstants";

function BugReportLayout({ bugReportState, setBugReportState }) {
    const [bugReportMessage, setBugReportMessage] = useState();
    const [errorLog, setErrorLog] = useState();
    const location = useLocation();
    const handleBugReportSubmitClick = async () => {
        showNotification({
            id: "bug-report-notif",
            loading: true,
            title: "Submitting your report",
            message: "Submitting your letter to our post box.",
            autoClose: false,
            disallowClose: true,
        });
        try {
            const animeSlug = location.pathname?.split("/anime/")[1]?.split("/")[0] ?? null;
            const episodeNumber = location.pathname?.split("/anime/")[1]?.split("/")[2] ?? null;
            await Promise.all([axios.post(`${API_BASE_URL}/reporting/bug?message=${bugReportMessage}&slug=${animeSlug}&episodeNumber=${episodeNumber}`)]);
            updateNotification({
                id: "bug-report-notif",
                color: "teal",
                title: "Success!",
                message: "Our postman did their job. We have your bug report!",
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            });
        } catch (e) {
            updateNotification({
                id: "bug-report-notif",
                color: "red",
                title: "Bummer!",
                message: "Our postman failed to deliver your bug report.They shall be FIRED!!!",
                icon: <IconCircleX size={16} />,
                autoClose: 2000,
            });
        }
    };
    const validateInput = () => {
        if (bugReportMessage.length < 20) {
            setErrorLog("Please provide message with atleast 20 character in length!");
            return false;
        }
        return true;
    };
    return (
        <>
            <Dialog opened={bugReportState} withCloseButton onClose={() => setBugReportState(false)} size="md" radius="md">
                <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
                    Report Problem
                </Text>
                {errorLog && (
                    <Alert color="red" sx={{ marginBottom: "10px" }}>
                        {errorLog}
                    </Alert>
                )}
                <Group align="flex-end">
                    <TextInput placeholder="Describe your problem here...." style={{ flex: 1 }} onChange={(event) => setBugReportMessage(event.currentTarget.value)} />
                    <Button
                        sx={{ backgroundColor: WATCHANIME_RED }}
                        onClick={(e) => {
                            if (!validateInput()) {
                                return;
                            }
                            setBugReportState(false);
                            handleBugReportSubmitClick();
                        }}
                    >
                        Submit
                    </Button>
                </Group>
            </Dialog>
        </>
    );
}

export default BugReportLayout;
