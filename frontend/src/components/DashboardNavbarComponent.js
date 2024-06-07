import React from "react";

import { IconBellRinging, IconFingerprint, IconKey, IconSettings, IconDatabaseImport, IconLogout, IconUserCircle } from "@tabler/icons";
import { Anchor, Group, Text, createStyles } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { signOut } from "../custom/Auth";

const useStyles = createStyles((theme) => ({
    navItem: {
        color: "inherit",
        textDecoration: "none",
        width: "100%",
        borderRadius: "4px",
        "&:focus, &:hover, &:visited, &:link, &:active": {
            textDecoration: "none",
        },
        "&:hover": {
            backgroundColor: "#2A2B2C",
            color: "white",
        },
    },
}));

function DashboardNavbarComponent({ activePage }) {
    const navigate = useNavigate();
    const { classes } = useStyles();

    const executeLogout = () => {
        signOut();
        navigate("/signin");
    };

    const data = [
        { link: "profile", label: "Profile", icon: IconUserCircle },
        { link: "security", label: "Security", icon: IconFingerprint },
        { link: "notifications", label: "Notifications", icon: IconBellRinging },
        { link: "settings", label: "Other Settings", icon: IconSettings },
        { link: "apikey", label: "API Keys", icon: IconKey },
        { link: "mal", label: "MAL", icon: IconDatabaseImport },
    ];
    return (
        <Group h={"100%"} sx={{ alignContent: "space-between" }}>
            <Group direction={"column"} sx={{ width: "100%", flexDirection: "column", alignItems: "flex-start", gap: "0px" }}>
                {data.map((item, index) => {
                    return (
                        <Anchor key={index} component={Link} to={`/dashboard/${item.link}`} className={classes.navItem} sx={item.link === activePage ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                            <Group sx={{ cursor: "pointer", padding: "10px 12px", gap: "12px" }}>
                                <item.icon size={20} />
                                <Text>{item.label}</Text>
                            </Group>
                        </Anchor>
                    );
                })}
            </Group>
            <Group w={"100%"}>
                <Group sx={{ cursor: "pointer", padding: "10px 12px" }} w={"100%"} onClick={executeLogout} className={classes.navItem}>
                    <IconLogout size={20} stroke={1.5} />
                    <span>Logout</span>
                </Group>
            </Group>
        </Group>
    );
}

export default DashboardNavbarComponent;
