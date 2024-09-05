import { createStyles, Group, Input, Paper, SegmentedControl, Text } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { IconUnlink, IconX } from "@tabler/icons";
import { getIdForLoggedInUser, pocketBaseInstance } from "../custom/Auth";
import { showGenericCheckBoxNotification } from "../custom/Notification";
import { getProxyDetails } from "../custom/UserDefinedProxy";

const useStyles = createStyles((theme) => ({
    pageButtons: {
        cursor: "pointer",
        backgroundColor: "rgb(35, 39, 42)",
        color: "white",
        padding: "8px 10px",
        fontSize: "14px",
        "&:hover": {
            borderColor: "1px solid red",
        },
    },
}));

function DashboardOtherSettingsLayout() {
    const { classes } = useStyles();
    const [activeTab, setActiveTab] = useState("proxysettings");
    const [proxyUrl, setProxyUrl] = useState("");
    const [useProxy, setUseProxy] = useState(false);
    let proxyRecordId = useRef(null);

    const proxyUrlChange = async (e) => {
        const newProxyUrl = e.target.value;
        if (!newProxyUrl || !newProxyUrl.includes("workers.dev")) {
            showGenericCheckBoxNotification("Invalid URL", "Please enter a valid URL", {
                color: "red",
                icon: <IconX size={16} />,
            });
            return;
        }
        setProxyUrl(newProxyUrl);
        const pb = pocketBaseInstance();

        if (!proxyUrl) {
            await pb.collection("proxy").create({
                url: newProxyUrl,
                useProxy: useProxy,
                userId: getIdForLoggedInUser(),
            });
        } else {
            await pb.collection("proxy").update(proxyRecordId.current, {
                url: newProxyUrl,
                useProxy: useProxy,
                userId: getIdForLoggedInUser(),
            });
        }
    };

    const useProxyChange = async (e) => {
        const newUseProxy = JSON.parse(e);
        setUseProxy(newUseProxy);
        const pb = pocketBaseInstance();
        await pb.collection("proxy").update(proxyRecordId.current, {
            url: proxyUrl,
            useProxy: newUseProxy,
            userId: getIdForLoggedInUser(),
        });
    };

    useEffect(() => {
        async function getProxyDetailsData() {
            try {
                const { id, url, useProxy } = await getProxyDetails();
                console.log({ id, url, useProxy });
                setProxyUrl(url);
                setUseProxy(useProxy);
                proxyRecordId.current = id;
            } catch (e) {}
        }

        getProxyDetailsData();
    }, []);

    return (
        <Group w={"100%"} h={"100%"} sx={{ justifyContent: "center", alignItems: "center" }}>
            <Group w={"100%"} h={"100%"} p={"md"} sx={{ flexDirection: "column" }}>
                <Group w={"100%"} sx={{ gap: "10px" }}>
                    <Paper className={classes.pageButtons} onClick={() => setActiveTab("proxysettings")} sx={activeTab === "proxysettings" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                        Proxy Settings
                    </Paper>
                    <Paper className={classes.pageButtons} onClick={() => setActiveTab("playersettings")} sx={activeTab === "playersettings" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                        Player Settings
                    </Paper>
                </Group>
                <Group w={"100%"} sx={{ gap: "20px", flexDirection: "column", alignItems: "flex-start" }} my={20}>
                    <Group w={"100%"}>
                        <Text>Proxy URL</Text>
                        <Input sx={{ flexGrow: 1 }} icon={<IconUnlink />} placeholder="Paste your proxy url..." onChange={proxyUrlChange} value={proxyUrl} />
                    </Group>
                    <Group>
                        <Text>Use proxy</Text>
                        <Paper sx={{ display: "flex", fontSize: "12px", borderRadius: "5px" }}>
                            <SegmentedControl
                                value={useProxy.toString()}
                                data={[
                                    { label: "Yes", value: "true", disabled: !proxyUrl.length },
                                    { label: "No", value: "false" },
                                ]}
                                onChange={useProxyChange}
                            />
                        </Paper>
                    </Group>
                </Group>
            </Group>
        </Group>
    );
}

export default DashboardOtherSettingsLayout;
