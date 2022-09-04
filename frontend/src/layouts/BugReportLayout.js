import { Button, Dialog, Group, Text, TextInput } from "@mantine/core";
import React from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";

function BugReportLayout({ bugReportState, setBugReportState }) {
    return (
        <>
            <Dialog opened={bugReportState} withCloseButton onClose={() => setBugReportState(false)} size="md" radius="md">
                <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
                    Report Problem
                </Text>

                <Group align="flex-end">
                    <TextInput placeholder="Describe your problem here...." style={{ flex: 1 }} />
                    <Button sx={{ backgroundColor: WATCHANIME_RED }} onClick={() => setBugReportState(false)}>
                        Submit
                    </Button>
                </Group>
            </Dialog>
        </>
    );
}

export default BugReportLayout;
