import React, { useEffect, useState } from "react";
import { AppShell, Navbar, Header, Text, MediaQuery, Burger, useMantineTheme, Group, Box } from "@mantine/core";
import HeaderLogoPartial from "../partials/HeaderLogoPartial";
import { Link, useParams } from "react-router-dom";
import NotificationComponent from "../components/NotificationComponent";
import DashboardNavbarComponent from "../components/DashboardNavbarComponent";
import DashboardBodyComponent from "../components/DashboardBodyComponent";
import { IconBellRinging, IconDatabaseImport, IconFingerprint, IconKey, IconListDetails, IconSettings, IconUserCircle } from "@tabler/icons";

function DashboardScreen({ isChristmasEnabled }) {
    const menuData = {
        profile: { link: "profile", label: "Profile", icon: IconUserCircle },
        security: { link: "security", label: "Security", icon: IconFingerprint },
        notifications: { link: "notifications", label: "Notifications", icon: IconBellRinging },
        watchlist: { link: "watchlist", label: "Watchlist", icon: IconListDetails },
        settings: { link: "settings", label: "Other Settings", icon: IconSettings },
        apikey: { link: "apikey", label: "API Keys", icon: IconKey },
        mal: { link: "mal", label: "MAL", icon: IconDatabaseImport, description: "MAL Import/Export" },
    };

    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const { pageType } = useParams();
    const [activePage, setActivePage] = useState("profile");
    const ActiveIcon = menuData[activePage].icon;

    useEffect(() => {
        if (pageType) setActivePage(pageType);
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
                    <DashboardNavbarComponent activePage={activePage} menuData={Object.values(menuData)} />
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
            <Group h={"100%"} w={"100%"} sx={{ justifyContent: "center", alignItems: "center", flexDirection: "column", flexWrap: "nowrap", gap: "10px" }}>
                <Group w={"100%"} sx={{ gap: "10px", alignItems: "center" }}>
                    <ActiveIcon size={"24px"} />
                    <Text sx={{ fontSize: "24px" }}>{menuData[activePage].description ?? menuData[activePage].label}</Text>
                </Group>
                <Box sx={{ flexGrow: 1, backgroundColor: "#1A1B1E", borderRadius: "5px" }} p={"md"} w={"100%"}>
                    <DashboardBodyComponent activePage={activePage} />
                </Box>
            </Group>
        </AppShell>
    );
}

export default DashboardScreen;
