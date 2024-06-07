import React, { useEffect, useState } from "react";
import { AppShell, Navbar, Header, Text, MediaQuery, Burger, useMantineTheme, Group, createStyles } from "@mantine/core";
import HeaderLogoPartial from "../partials/HeaderLogoPartial";
import { Link, useParams } from "react-router-dom";
import NotificationComponent from "../components/NotificationComponent";
import DashboardNavbarComponent from "../components/DashboardNavbarComponent";
import DashboardBodyComponent from "../components/DashboardBodyComponent";

function DashboardScreen({ isChristmasEnabled, match }) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const { pageType } = useParams();
    const [activePage, setActivePage] = useState();

    useEffect(() => {
        setActivePage(pageType || "profile");
    }, [pageType]);

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 300 }}>
                    <DashboardNavbarComponent activePage={activePage} />
                </Navbar>
            }
            header={
                <Header height={56} p="md">
                    <div style={{ display: "flex", alignItems: "center", height: "100%", justifyContent: "space-between" }}>
                        <Group>
                            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                                <Burger opened={opened} onClick={() => setOpened((o) => !o)} size="sm" color={theme.colors.gray[6]} mr="xl" />
                            </MediaQuery>
                            <Link to="/">
                                <HeaderLogoPartial isChristmasEnabled={isChristmasEnabled} mobile={false} />
                            </Link>
                        </Group>
                        <Group>
                            <NotificationComponent />
                        </Group>
                    </div>
                </Header>
            }
        >
            <DashboardBodyComponent activePage={activePage} />
        </AppShell>
    );
}

export default DashboardScreen;
