import { Container, Group, Text, Title } from "@mantine/core";
import React from "react";

function PrivacyPolicyScreen() {
    return (
        <Container sx={{ padding: "80px" }} fluid>
            <Group>
                <Group>
                    <Title sx={{ width: "100%" }}>Cookies & 3rd Party Analytics</Title>
                    <Text>Google, as a third party vendor, uses cookies to collect tracking information. For more info please visit Google Analytics Privacy Policy</Text>
                </Group>
            </Group>
        </Container>
    );
}

export default PrivacyPolicyScreen;
