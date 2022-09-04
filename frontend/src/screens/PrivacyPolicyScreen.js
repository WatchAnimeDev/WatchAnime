import { Container, Group, Text, Title } from "@mantine/core";
import React from "react";
import SideBarComponent from "../components/SideBarComponent";

function PrivacyPolicyScreen({ sideBarState, setSideBarState, bugReportState, setBugReportState }) {
    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }, { label: "Random" }],
    };
    return (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ bugReportState, setBugReportState }} />

            <Container sx={{ padding: "80px" }} fluid>
                <Group>
                    <Group>
                        <Title sx={{ width: "100%" }}>Cookies & 3rd Party Analytics</Title>
                        <Text>Google, as a third party vendor, uses cookies to collect tracking information. For more info please visit Google Analytics Privacy Policy</Text>
                    </Group>
                </Group>
            </Container>
        </>
    );
}

export default PrivacyPolicyScreen;
