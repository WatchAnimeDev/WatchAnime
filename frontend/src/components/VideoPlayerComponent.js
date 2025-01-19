import { Box, Button, createStyles, Divider, Group, Radio, Text, Title, Tooltip, UnstyledButton } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL, GOGO_DOWNLOAD_LINK } from "../constants/genricConstants";
import { getAnimeTitleByRelevance, getEpisodeCount, malStatusToMediaStatus, nextEpisodeUrl, prepareVideoData, prevEpisodeUrl } from "../custom/AnimeData";
import VideoPlayer from "../player/VideoPlayer";
import { getAnimeSkipData } from "../player/PlayerHelper";
import { IconDownload, IconPlayerTrackNext, IconPlayerTrackPrev, IconSettings } from "@tabler/icons-react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { openConfirmModal } from "@mantine/modals";
import VideoScreenEpisodeDisplayPartial from "../partials/VideoScreenEpisodeDisplayPartial";
import VideoScreenIframePartial from "../partials/VideoScreenIframePartial";
import { useLanguageStore } from "../store/LanguageToggleStore";
import { useShallow } from "zustand/react/shallow";
import { getPlayerSettings, setPlayerSettings } from "../custom/PlayerSettings";
import { dismissGenericDynamicNotification, showGenericDynamicNotification } from "../custom/Notification";
import { syncLastWatched, syncWatchHistory } from "../custom/CloudSync";

const useStyles = createStyles((theme) => ({
    parentPlayerDiv: {
        height: "fit-content",
        width: "100%",
        maxWidth: "900px",
        alignItems: "baseline",
        gap: 0,
    },
    changeServerButton: {
        backgroundColor: WATCHANIME_RED,
        fontSize: "14px",
        padding: "3px 5px",
        height: "fit-content",
        alignItems: "center",
        "&:hover": {
            textDecoration: "none",
            backgroundColor: WATCHANIME_RED,
        },
    },
    videoDetailsDiv: {
        width: "100%",
        height: "fit-content",
        padding: "15px 20px",
        backgroundColor: "#2A2B2C",
        gap: 0,
        marginBottom: "25px",
    },
    skipButtonParentDiv: {
        padding: "0 !important",
        width: "fit-content !important",
        right: "25px !important",
        bottom: "5em !important",
    },
    skipButtonInternalDiv: {
        padding: "10px 15px !important",
        backgroundColor: "rgb(38 38 38 / 1)",
        opacity: "0.8",
        cursor: "pointer",
        border: "1px solid white",
        "&:hover": {
            opacity: "1",
        },
    },
    skipButtonTextDiv: {
        opacity: "1",
        fontSize: "15px",
    },
}));

const updatePlaybackInWathHistoryBySlug = (player, slug, episodeNumber) => {
    if (player.playing) {
        syncWatchHistory(slug, episodeNumber, { duration: player.duration, playBackTime: player.currentTime });
    } else {
        console.log("player is paused. Not updating watch history");
    }
};

function VideoPlayerComponent({ episodeData, episodeDecoderData, watchHistoryData, userDefinedProxyUrl }) {
    const { classes } = useStyles();
    const playerRef = useRef(null);
    const videoCounter = useRef(0);
    const location = useLocation();
    const firstRender = useRef(true);
    const navigate = useNavigate();
    const [selectedServer, setSelectedServer] = useState("Alpha");
    const [adfreeServer, setAdfreeServer] = useState(true);
    const [autoPlay, setAutoPlay] = useState(getPlayerSettings("autoPlay"));
    const [autoSkipIntro, setAutoSkipIntro] = useState(getPlayerSettings("autoSkipIntro"));
    const selectedServerModal = useRef("Alpha");
    const { language } = useLanguageStore(useShallow((state) => ({ language: state.language })));

    const autoSkipTimeout = 5000;
    let autoSkipStarted = false;

    videoCounter.current = 0;

    const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
    const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];

    let preparedVideoData = prepareVideoData(episodeDecoderData.videoUrlList, userDefinedProxyUrl);

    const toggleAutoPlay = () => {
        setAutoPlay(!autoPlay);
        setPlayerSettings(!autoPlay, "autoPlay");
    };

    const toggleAutoSkipIntro = () => {
        setAutoSkipIntro(!autoSkipIntro);
        setPlayerSettings(!autoSkipIntro, "autoSkipIntro");
    };

    useEffect(() => {
        async function getAnimeDetails() {
            const [episodeAnimeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/decoder/${animeSlug}/${episodeNumber}/${selectedServer}`)]);
            const preparedVideoDataAjax = prepareVideoData(episodeAnimeAjaxData.data.videoUrlList, userDefinedProxyUrl);
            playerRef.current.switch = preparedVideoDataAjax[0].link;
            playerRef.current.videoUrlList = episodeAnimeAjaxData.data.videoUrlList;
            playerRef.current.shouldAjax = true;
            return;
        }
        if (!firstRender.current && !selectedServer.includes("_ad")) {
            getAnimeDetails();
        } else {
            firstRender.current = false;
        }
        // eslint-disable-next-line
    }, [selectedServer]);

    const openModal = () =>
        openConfirmModal({
            title: "Server Selector",
            children: (
                <Group>
                    <Box w={"100%"}>
                        {episodeData.sources.adfree.length > 0 ? (
                            <Radio.Group
                                label="AdFree Servers"
                                onChange={(e) => {
                                    selectedServerModal.current = e;
                                }}
                            >
                                {episodeData.sources.adfree.map((server, ind) => {
                                    return <Radio key={ind} value={`${server}`} label={`${server}`} />;
                                })}
                            </Radio.Group>
                        ) : (
                            <></>
                        )}
                    </Box>
                    <Box w={"100%"}>
                        {episodeData.sources.others.length > 0 ? (
                            <Radio.Group
                                label="Ad Supported Servers"
                                onChange={(e) => {
                                    selectedServerModal.current = e;
                                }}
                            >
                                {episodeData.sources.others.map((server, ind) => {
                                    return <Radio key={ind} value={`${server.name}_ad`} label={`${server.name}`} />;
                                })}
                            </Radio.Group>
                        ) : (
                            <></>
                        )}
                    </Box>
                </Group>
            ),
            labels: { confirm: "Confirm", cancel: "Cancel" },
            onCancel: () => {
                selectedServerModal.current = selectedServer;
            },
            onConfirm: () => {
                setSelectedServer(selectedServerModal.current);
                playerRef.current.selectedServer = selectedServerModal.current;
                setAdfreeServer(!playerRef.current.selectedServer.includes("_ad"));
                clearInterval(playerRef.current.watchTimeTracker);
            },
        });

    videoCounter.current = videoCounter.current + 1;

    const handlePlayerReady = (player) => {
        playerRef.current = player;
        playerRef.current.shouldAjax = true;
        playerRef.current.skipData = [];
        /**
         * Player Events
         */
        player.on("ready", async () => {
            player.autoSize();
        });
        player.on("subtitleLoad", (url) => {
            console.info("subtitleLoad", url);
        });
        player.on("subtitle", (state) => {
            console.log("subtitle", state);
        });
        player.on("video:timeupdate", async () => {
            const currentSkipData = playerRef.current.skipData.filter((time) => time.startTime <= player.currentTime && time.endTime >= player.currentTime);
            //If there is length that means current time is in the skipData
            if (currentSkipData.length !== 0) {
                //if autoSkipIntro is true then we should skip to the end of the skipData without showing the skip button
                if (autoSkipIntro) {
                    player.currentTime = currentSkipData[0].endTime + 1;
                } else {
                    //If autoSkipIntro is false then we should show the skip button but skip if the button is already shown
                    if (!player.layers.cache.has("skipTime")) {
                        player.layers.add({
                            name: "skipTime",
                            html: `<div class="${classes.skipButtonInternalDiv}" ><div class="${classes.skipButtonTextDiv}">${currentSkipData[0].displayString}</div></div>`,
                            style: {
                                position: "absolute",
                                bottom: "75px",
                                right: "25px",
                            },
                            click: function (...args) {
                                player.currentTime = currentSkipData[0].endTime + 1;
                            },
                        });
                    }
                }
            } else {
                //If there is no length that means current time is not in the skipData so we should remove the skip button if it is shown
                if (player.layers.cache.has("skipTime")) {
                    player.layers.remove("skipTime");
                }
            }

            if (autoPlay && episodeData.animeDetails.episodes !== parseInt(episodeNumber) && Math.ceil(player.duration - player.currentTime) <= autoSkipTimeout / 1000 && !autoSkipStarted && player.playing) {
                autoSkipStarted = true;
                showGenericDynamicNotification("autoplaynextepisode", "Auto Play", `Next Episode starting in ${autoSkipTimeout / 1000} seconds`);
                setTimeout(() => {
                    dismissGenericDynamicNotification("autoplaynextepisode", "Auto Play", "Redirecting now...");
                }, autoSkipTimeout);
                setTimeout(() => {
                    navigate(nextEpisodeUrl(animeSlug, parseInt(episodeNumber), episodeData.animeDetails.episodes));
                    autoSkipStarted = false;
                }, autoSkipTimeout + 1000);
            }
        });
        player.on("video:waiting", () => {
            console.log("player is waiting");
        });
        player.on("destroy", () => {
            console.log("player will dispose");
            clearInterval(player.watchTimeTracker);
        });
        player.on("video:ended", () => {
            console.log("player video ended");
        });
        player.on("video:loadeddata", async () => {
            console.log("player have loadeddata");
            //Get last watched info
            let lastWatchedTime = watchHistoryData?.[episodeNumber]?.playBackTime || 0;
            //Use current time instead of seek to skip watched portions
            player.currentTime = lastWatchedTime;
            //Only set poster if no watchtime found
            if (lastWatchedTime === 0) {
                player.poster = episodeData.poster;
            }
            syncLastWatched(animeSlug, episodeNumber);
            syncWatchHistory(animeSlug, episodeNumber, { duration: player.duration, playBackTime: player.currentTime });
            player.watchTimeTracker = setInterval(updatePlaybackInWathHistoryBySlug.bind(null, player, animeSlug, episodeNumber), 15000);
            //Init and store aniskip
            playerRef.current.skipData = await getAnimeSkipData(episodeData.animeDetails, episodeNumber, player.duration);
        });
        player.selectedServer = selectedServer;
        playerRef.current.videoUrlList = episodeDecoderData.videoUrlList;
    };

    return (
        <>
            <Group pt={"80px"} sx={{ width: "100%", justifyContent: "center" }}>
                <Group className={classes.parentPlayerDiv}>
                    <Group sx={{ backgroundColor: "#353738", width: "100%", fontSize: "14px", padding: "2px 10px", justifyContent: "space-between" }}>
                        <Group sx={{ gap: "5px" }}>
                            <Text>EP {episodeNumber}</Text>
                            <Divider orientation="vertical" />
                            <Text>{!selectedServer.includes("_ad") ? `Internal Player` : `External Player`}</Text>
                        </Group>
                        <Group>
                            <Tooltip label="Previous Episode">
                                <UnstyledButton component={Link} to={prevEpisodeUrl(animeSlug, parseInt(episodeNumber))}>
                                    <IconPlayerTrackPrev size={14} />
                                </UnstyledButton>
                            </Tooltip>
                            <Tooltip label="Next Episode">
                                <UnstyledButton component={Link} to={nextEpisodeUrl(animeSlug, parseInt(episodeNumber), episodeData.animeDetails.episodes)}>
                                    <IconPlayerTrackNext size={14} />
                                </UnstyledButton>
                            </Tooltip>
                            <Tooltip label="Download Episode">
                                <UnstyledButton
                                    onClick={(e) => {
                                        window.open(
                                            `${GOGO_DOWNLOAD_LINK}/download?id=${
                                                episodeData.sources.others
                                                    .filter((source) => source.name === "Vidstreaming")[0]
                                                    .iframe.split("?id=")[1]
                                                    .split("&")[0]
                                            }`,
                                            "_blank"
                                        );
                                    }}
                                >
                                    <IconDownload size={14} />
                                </UnstyledButton>
                            </Tooltip>
                        </Group>
                    </Group>
                    {adfreeServer ? (
                        <VideoPlayer onReady={handlePlayerReady} option={{ url: preparedVideoData[0].link, subtitles: preparedVideoData[0].subtitles }} />
                    ) : (
                        <VideoScreenIframePartial iframeCollectionData={episodeData.sources.others} selectedServer={selectedServer} />
                    )}
                    <Group sx={{ width: "100%", backgroundColor: "#272727" }} c={"white"} py={"5px"} px={"10px"}>
                        <Group onClick={toggleAutoSkipIntro} sx={{ cursor: "pointer", gap: "5px" }}>
                            <Text sx={{ fontSize: "12px" }}>Auto Skip Intro</Text>
                            <Text sx={{ fontSize: "12px" }} c={WATCHANIME_RED} fw={600}>
                                {autoSkipIntro ? "On" : "Off"}
                            </Text>
                        </Group>
                        <Group onClick={toggleAutoPlay} sx={{ cursor: "pointer", gap: "5px" }}>
                            <Text sx={{ fontSize: "12px" }}>Auto Next Episode</Text>
                            <Text sx={{ fontSize: "12px" }} c={WATCHANIME_RED} fw={600}>
                                {autoPlay ? "On" : "Off"}
                            </Text>
                        </Group>
                    </Group>
                    <Group className={classes.videoDetailsDiv}>
                        <Group sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Title sx={{ fontSize: "20px", fontWeight: "400" }}>{getAnimeTitleByRelevance(episodeData.animeDetails.titles, false, language)}</Title>
                            <Button className={classes.changeServerButton} onClick={openModal}>
                                <IconSettings size={14} />
                                <Text sx={{ paddingLeft: "5px" }}>Change Server</Text>
                            </Button>
                        </Group>
                        <VideoScreenEpisodeDisplayPartial
                            episodeCount={getEpisodeCount(episodeData.animeDetails)}
                            episodeList={episodeData.animeDetails.episodeList}
                            animeSlug={animeSlug}
                            currentEpisode={episodeNumber}
                            watchHistoryData={watchHistoryData}
                        />
                        <Divider sx={{ width: "100%", margin: "10px 0px" }} />
                        <Group sx={{ fontSize: "12px", flexDirection: "column", alignItems: "baseline", gap: "0px" }}>
                            <Group sx={{ gap: "5px" }}>
                                <Text>Genres:</Text>
                                <Text>{episodeData.animeDetails?.genres?.map((genre) => genre.name).join(", ")}</Text>
                            </Group>
                            <Group sx={{ gap: "5px" }}>
                                <Text>Status:</Text>
                                <Text>{malStatusToMediaStatus(episodeData.animeDetails.status)}</Text>
                                <Divider orientation="vertical" />
                                <UnstyledButton sx={{ fontSize: "10px", padding: "1px 7px", backgroundColor: "#636363" }} component={Link} to={`/anime/${animeSlug}`}>
                                    More Info
                                </UnstyledButton>
                            </Group>
                        </Group>
                    </Group>
                </Group>
            </Group>
        </>
    );
}

export default VideoPlayerComponent;
