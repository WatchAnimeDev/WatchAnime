import { Alert, Button, createStyles, Group, Paper, SegmentedControl, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import malImage from "../assets/images/mal.png";
import aniImage from "../assets/images/ani.png";
import axios from "axios";
import { API_BASE_URL, OAUTH_BASE_URL } from "../constants/genricConstants";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
import { pocketBaseInstance, userData } from "../custom/Auth";
import { openConfirmModal } from "@mantine/modals";

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
    aniDiv: {
        height: 24,
        width: 24,
        backgroundImage: `url(${aniImage})`,
        backgroundSize: "cover",
    },
    malDiv: {
        height: 24,
        width: 24,
        backgroundImage: `url(${malImage})`,
        backgroundSize: "cover",
    },
    importSubmitButton: {
        backgroundColor: "#2a3845",
        // width: "100px ",
        "&:hover": {
            backgroundColor: "#203951",
        },
    },
}));

function DashboardEpisodeTracking() {
    const { classes } = useStyles();
    const pbUserData = userData().model;
    const navigate = useNavigate();

    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();
    const isCallbackVal = searchParams.get("status");
    // const isLoggedIn = pbUserData.metaData?.episodeTracking[activeOauthProvider] || isCallbackVal === "success";
    const [activeOauthProvider, setActiveOauthProvider] = useState(searchParams.get("provider") || "mal");
    const [isTrackingActive, setIsTrackingActive] = useState(pbUserData.metaData?.episodeTracking[activeOauthProvider]?.isTrackingActive || false);

    useEffect(() => {
        const insertOauthDetails = async () => {
            const postData = new FormData();
            const pb = pocketBaseInstance();
            const metaData = pbUserData.metaData || { episodeTracking: {} };
            metaData["episodeTracking"][activeOauthProvider] = { isTrackingActive: true };
            postData.append("metaData", JSON.stringify(metaData));
            await pb.collection("users").update(pbUserData.id, postData);
            await axios.post(`${API_BASE_URL}/auth/oauth/set`, {
                refresh_token: searchParams.get("refresh_token"),
                access_token: searchParams.get("access_token"),
                provider: activeOauthProvider,
                userId: pbUserData.id,
                token_type: searchParams.get("token_type") || "Bearer",
                expires_in: searchParams.get("expires_in"),
            });
            navigate(`/dashboard/episodetracking?provider=${activeOauthProvider}`);
            setIsTrackingActive(true);
        };
        if (isCallbackVal === "success") {
            insertOauthDetails();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!pbUserData.metaData?.episodeTracking?.[activeOauthProvider] || pbUserData.metaData.episodeTracking[activeOauthProvider].isTrackingActive === isTrackingActive) return;
        const postData = new FormData();
        const pb = pocketBaseInstance();
        const metaData = pbUserData.metaData || { episodeTracking: {} };
        metaData["episodeTracking"][activeOauthProvider].isTrackingActive = isTrackingActive;
        postData.append("metaData", JSON.stringify(metaData));
        pb.collection("users").update(pbUserData.id, postData);
        const updateOauthDetails = async () => {
            await axios.post(`${API_BASE_URL}/auth/oauth/update`, {
                provider: activeOauthProvider,
                userId: pbUserData.id,
                isTrackingEnabled: JSON.parse(isTrackingActive),
            });
        };
        updateOauthDetails();
        // eslint-disable-next-line
    }, [isTrackingActive]);

    const oauthProviderList = {
        mal: { name: "MyAnimeList", icon: classes.malDiv },
        ani: { name: "Anilist", icon: classes.aniDiv },
    };

    const handleOauthProviderLink = async () => {
        const oauthUrl = await axios.get(`${OAUTH_BASE_URL}/oauth/authenticate?provider=${activeOauthProvider}`);
        window.location.href = oauthUrl.data.url;
    };

    const handleOauthProviderToggle = async (provider) => {
        setActiveOauthProvider(provider);
        setIsTrackingActive(pbUserData.metaData?.episodeTracking[provider]?.isTrackingActive || false);
        navigate(`/dashboard/episodetracking?provider=${provider}`);
    };

    const handleOauthProviderDeLink = async () => {
        const postData = new FormData();
        const pb = pocketBaseInstance();
        const metaData = pbUserData.metaData || { episodeTracking: {} };
        delete metaData["episodeTracking"][activeOauthProvider];
        postData.append("metaData", JSON.stringify(metaData));
        pb.collection("users").update(pbUserData.id, postData);
        await axios.post(`${API_BASE_URL}/auth/oauth/delete`, {
            provider: activeOauthProvider,
            userId: pbUserData.id,
        });
        setIsTrackingActive(false);
    };

    const openDelinkModal = () =>
        openConfirmModal({
            title: "Delink " + oauthProviderList[activeOauthProvider].name,
            centered: true,
            size: "lg",
            children: (
                <Group>
                    <Paper w={"100%"}>
                        <Text>Are you sure you want to delink your {oauthProviderList[activeOauthProvider].name} account? This action will disable automatic episode tracking. </Text>
                    </Paper>
                </Group>
            ),
            labels: { confirm: "Delink account", cancel: "No don't delink it" },
            confirmProps: { color: "red" },
            onCancel: () => {},
            onConfirm: () => {
                handleOauthProviderDeLink();
            },
        });

    return (
        <Group w={"100%"} h={"100%"} p={"md"} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Group w={"100%"} sx={{ gap: "10px" }}>
                <Paper className={classes.pageButtons} onClick={() => handleOauthProviderToggle("mal")} sx={activeOauthProvider === "mal" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                    <Group sx={{ gap: "5px" }}>
                        <Text>MyAnimeList</Text>
                        <Paper className={classes.malDiv}></Paper>
                    </Group>
                </Paper>
                <Paper className={classes.pageButtons} onClick={() => handleOauthProviderToggle("ani")} sx={activeOauthProvider === "ani" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                    <Group sx={{ gap: "5px" }}>
                        <Text>Anilist</Text>
                        <Paper className={classes.aniDiv}></Paper>
                    </Group>
                </Paper>
            </Group>
            <Group w={"100%"}>
                <Text w={"100%"}>Sign in with {oauthProviderList[activeOauthProvider].name} for auto episode tracking.</Text>

                {!pbUserData.metaData?.episodeTracking[activeOauthProvider] ? (
                    <Text w={"100%"}>
                        You are not signed in with {oauthProviderList[activeOauthProvider].name}. Please sign in with {oauthProviderList[activeOauthProvider].name} to enable auto episode tracking settings.
                    </Text>
                ) : (
                    <Text w={"100%"}>You have already signed in with {oauthProviderList[activeOauthProvider].name}. Please use the epsiode tracking toggle to disable/enable auto episode tracking.</Text>
                )}

                {pbUserData.metaData?.episodeTracking[activeOauthProvider] ? (
                    <Group>
                        <Text>Auto Episode Tracking</Text>
                        <Paper sx={{ display: "flex", fontSize: "12px", borderRadius: "5px" }}>
                            <SegmentedControl
                                value={isTrackingActive.toString()}
                                data={[
                                    { label: "Yes", value: "true" },
                                    { label: "No", value: "false" },
                                ]}
                                onChange={setIsTrackingActive}
                            />
                        </Paper>
                    </Group>
                ) : (
                    <Group w={"100%"}>
                        <Button className={classes.importSubmitButton} onClick={handleOauthProviderLink}>
                            <Group sx={{ gap: "5px", alignItems: "center", justifyContent: "center" }}>
                                <Text>Sign In With</Text>
                                <Paper className={oauthProviderList[activeOauthProvider].icon}></Paper>
                            </Group>
                        </Button>
                    </Group>
                )}

                {isCallbackVal === "fail" ? (
                    <Alert icon={<IconX size={16} />} color="red" title="Sign In Failed" className="ouath-error">
                        <Text>Failed to sign in with {oauthProviderList[activeOauthProvider].name}. Either you cancelled the signin process or something went wrong. Please try again.</Text>
                    </Alert>
                ) : (
                    <></>
                )}

                {pbUserData.metaData?.episodeTracking[activeOauthProvider] ? (
                    <Group w={"100%"}>
                        <Button className={classes.importSubmitButton} onClick={openDelinkModal}>
                            <Group sx={{ gap: "5px", alignItems: "center", justifyContent: "center" }}>
                                <Text>Delink Account</Text>
                                <Paper className={oauthProviderList[activeOauthProvider].icon}></Paper>
                            </Group>
                        </Button>
                    </Group>
                ) : (
                    <></>
                )}
            </Group>
        </Group>
    );
}

export default DashboardEpisodeTracking;
