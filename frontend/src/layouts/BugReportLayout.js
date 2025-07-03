import { Alert, Button, Group, Modal, Text, TextInput, Textarea } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconCircleX } from "@tabler/icons-react";
import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { API_BASE_URL } from "../constants/genricConstants";
import { userData } from "../custom/Auth";

function BugReportLayout({ bugReportState, setBugReportState }) {
    const [bugReportMessage, setBugReportMessage] = useState("");
    const [bugReportContactDetails, setBugReportContactDetails] = useState("");
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
            const message = `Details : ${bugReportMessage} | Contact : ${bugReportContactDetails} | uid : ${userData()?.record?.id}`;
            await Promise.all([axios.post(`${API_BASE_URL}/reporting/bug?message=${message}&slug=${animeSlug}&episodeNumber=${episodeNumber}`)]);
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
        // eslint-disable-next-line
        if (bugReportContactDetails && (/^.{3,32}#[0-9]{4}$/.test(bugReportContactDetails) === false || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(bugReportContactDetails) === false)) {
            setErrorLog("Please provide a valid email or disord username!");
            return false;
        }
        return true;
    };

    return (
        <Modal
            opened={bugReportState}
            onClose={() => {
                setBugReportState(false);
                setErrorLog("");
            }}
            title="Report Problem"
        >
            {errorLog && (
                <Alert color="red" sx={{ marginBottom: "10px" }}>
                    {errorLog}
                </Alert>
            )}
            <Group sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                <TextInput sx={{ width: "100%" }} label="Contact Info" placeholder="Please mention your email or discord id." onChange={(event) => setBugReportContactDetails(event.currentTarget.value)}></TextInput>
                <Textarea required={true} sx={{ width: "100%" }} label="Describe your problem here" placeholder="Describe your problem here...." onChange={(event) => setBugReportMessage(event.currentTarget.value)} />
                <Text size={"12px"}>All fields marked with * are required</Text>
                <Button
                    sx={{ backgroundColor: WATCHANIME_RED }}
                    onClick={(e) => {
                        if (!validateInput()) {
                            return;
                        }
                        setBugReportState(false);
                        setErrorLog("");
                        handleBugReportSubmitClick();
                    }}
                >
                    Submit
                </Button>
            </Group>
        </Modal>
    );
}

export default BugReportLayout;
