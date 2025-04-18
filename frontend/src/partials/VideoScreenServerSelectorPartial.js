import { createStyles, Group, Paper, Text } from "@mantine/core";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import axios from "axios";

import { getImageByRelevance } from "../custom/AnimeData";
import { IconDownload } from "@tabler/icons-react";
import { userData } from "../custom/Auth";
import { openConfirmModal } from "@mantine/modals";
import { API_BASE_URL } from "../constants/genricConstants";
import { dismissGenericDynamicNotification, showGenericDynamicNotification } from "../custom/Notification";

const useStyles = createStyles((theme) => ({
    backgroundImageDiv: {
        backgroundSize: "cover",
        backgroundPosition: "center center",
        filter: "blur(20px)",
        opacity: ".35",
        width: "90%",
        position: "absolute",
        paddingTop: "25% !important",
    },
    flagAndTextDiv: {
        gap: "0.275rem",
        backgroundColor: "#0f172a80",
        fontSize: "0.75rem",
        borderRadius: "0.375rem",
    },
    parentDiv: {
        backgroundColor: "#4b556338",
        color: "white",
        filter: "drop-shadow(0 10px 8px rgb(0 0 0 / .04)) drop-shadow(0 4px 3px rgb(0 0 0 / .1))",
        cursor: "pointer",
        borderRadius: "4px",
        "&:hover": {
            backgroundColor: "#4b556380",
        },
    },
    downloadButtonDiv: {
        backgroundColor: "transparent",
        cursor: "pointer",
        zIndex: "1",
    },
    downloadButton: {
        color: "white",
    },
}));

const openCacheModal = (animeDetails, episodeNumber, server) => {
    openConfirmModal({
        title: "Video Cache",
        closeOnConfirm: true,
        closeOnCancel: true,
        closeOnClickOutside: true,
        labels: { confirm: "Start Cache", cancel: "Dont Cache" },
        children: (
            <Group>
                <Text size="md">
                    Would you like to start video cache for episode {episodeNumber} of {animeDetails.slug} from source {server}?
                </Text>
            </Group>
        ),
        cancelProps: { sx: { backgroundColor: "red !important" } },
        centered: true,
        onConfirm: async () => {
            const episodeAnimeAjaxData = await axios.get(`${API_BASE_URL}/episode/decoder/${animeDetails.slug}/${episodeNumber}/${server}`);
            showGenericDynamicNotification("video-cache", "Starting Cache", `Starting Cache for episode ${episodeNumber} of ${animeDetails.slug} from source ${server}`);
            await axios.post(`${API_BASE_URL}/proxy/cache`, {
                slug: animeDetails.slug,
                episodeNumber: episodeNumber,
                opn: "clone",
                url: episodeAnimeAjaxData.data.videoUrlList[0].url,
                headers: {
                    ...(server.toLowerCase().includes("hd") || server.toLowerCase().includes("alpha") ? { referer: "https://megacloud.club/" } : {}),
                },
                subs: Object.keys(episodeAnimeAjaxData.data.videoUrlList[0]?.subtitles || {}).length ? [episodeAnimeAjaxData.data.videoUrlList[0].subtitles.url] : [],
            });
            dismissGenericDynamicNotification("video-cache", "Started Cache", `Started Cache for episode ${episodeNumber} of ${animeDetails.slug} from source ${server}`);
        },
    });
};

function VideoScreenServerSelectorPartial({ server, episodeData, selectedServerModal, selectedServer, episodeNumber }) {
    const { classes } = useStyles();
    const isDub = episodeData.animeDetails.slug.includes("-dub") || server.name.includes(" eng");
    const userDataFromStore = userData();
    return (
        <Group
            className={`${classes.parentDiv} ${selectedServer === server.name ? "selected-server" : ""}`}
            w={"100%"}
            py={"sm"}
            px={"md"}
            onClick={(e) => {
                selectedServerModal.current = server.name;
                e.currentTarget.parentNode.childNodes.forEach((x) => x.classList.remove("selected-server"));
                e.currentTarget.classList.add("selected-server");
            }}
            key={server.name}
        >
            <Group w={"100%"} sx={{ justifyContent: "center" }}>
                <Text order={4}>{server.name.split("|").pop()}</Text>
            </Group>
            <Group>
                <Group sx={{ maxWidth: "85%" }}>
                    <Group w={"100%"} sx={{ fontSize: "0.875rem" }}>
                        <Group sx={{ gap: "0.275rem" }}>
                            Duration:
                            <Text sx={{ backgroundColor: "#0f172a80", fontSize: "0.75rem", borderRadius: "0.375rem" }} px={"0.5rem"} py={"0.25rem"}>
                                24:00
                            </Text>
                        </Group>
                        <Group sx={{ gap: "0.275rem" }}>
                            Source:
                            <Text sx={{ backgroundColor: "#0f172a80", fontSize: "0.75rem", borderRadius: "0.375rem" }} px={"0.5rem"} py={"0.25rem"}>
                                WEB
                            </Text>
                        </Group>
                    </Group>
                    <Group w={"100%"} sx={{ fontSize: "0.875rem", gap: "0.275rem" }}>
                        Audio:
                        <Group>
                            <Group className={classes.flagAndTextDiv} px={"0.5rem"} py={"0.25rem"}>
                                <ReactCountryFlag
                                    countryCode={isDub ? "GB" : "JP"}
                                    svg
                                    style={{
                                        width: "16px",
                                    }}
                                />
                                {isDub ? "English" : "Japanese"}
                            </Group>
                        </Group>
                    </Group>
                    <Group w={"100%"} sx={{ fontSize: "0.875rem", gap: "0.275rem" }}>
                        {!server.info.availableSub.length || isDub ? "" : server.info.isSoftSub && server.info.isHardSub ? "Soft/Hard Sub:" : server.info.isSoftSub ? "Soft Sub:" : "Hard Sub:"}
                        <Group>
                            {!isDub &&
                                server.info.availableSub.map((sub, ind) => {
                                    return (
                                        <Group className={classes.flagAndTextDiv} px={"0.5rem"} py={"0.25rem"} key={ind}>
                                            <ReactCountryFlag
                                                countryCode={sub.flag}
                                                svg
                                                style={{
                                                    width: "16px",
                                                }}
                                            />
                                            {sub.name}
                                        </Group>
                                    );
                                })}
                        </Group>
                    </Group>
                </Group>
                {userDataFromStore.model.roles.includes("admin") ? (
                    <Group>
                        <Paper className={classes.downloadButtonDiv}>
                            <IconDownload
                                className={classes.downloadButton}
                                onClick={(e) => {
                                    e.preventDefault();
                                    openCacheModal(episodeData.animeDetails, episodeNumber, server.name);
                                }}
                            />
                        </Paper>
                    </Group>
                ) : (
                    <></>
                )}
            </Group>

            <Group px={"5%"} pt={80} className={classes.backgroundImageDiv} sx={{ backgroundImage: `url(${episodeData.animeDetails.bannerImage ?? getImageByRelevance(episodeData.animeDetails.images)})` }}></Group>
        </Group>
    );
}

export default VideoScreenServerSelectorPartial;
