import { Button, createStyles, Divider, Group, Radio, Text, Title, Tooltip, UnstyledButton } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL, GOGO_DOWNLOAD_LINK } from "../constants/genricConstants";
import { getAnimeTitleByRelevance, getEpisodeCount, nextEpisodeUrl, prepareVideoData, prevEpisodeUrl } from "../custom/AnimeData";
import VideoPlayer from "../player/VideoPlayer";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "videojs-hotkeys";
import "videojs-overlay";
import "videojs-overlay/dist/videojs-overlay.css";
import { showNotification } from "@mantine/notifications";
import { getLastWatchedData, getAnimeSkipData, initHlsSelector, setLastWatchedQueue, setWatchHistoryBySlug } from "../player/PlayerHelper";
import { IconDeviceTv, IconDeviceTvOff, IconDownload, IconPlayerTrackNext, IconPlayerTrackPrev, IconSettings } from "@tabler/icons";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { openConfirmModal } from "@mantine/modals";
import VideoScreenEpisodeDisplayPartial from "../partials/VideoScreenEpisodeDisplayPartial";
import VideoScreenIframePartial from "../partials/VideoScreenIframePartial";

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
        padding: "10px 15px",
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
    setWatchHistoryBySlug({ slug: slug }, { duration: player.duration(), playBackTime: player.currentTime() }, episodeNumber);
};

function VideoPlayerComponent({ episodeData, episodeDecoderData }) {
    const { classes } = useStyles();
    const playerRef = useRef(null);
    const videoCounter = useRef(0);
    const location = useLocation();
    const firstRender = useRef(true);
    const navigate = useNavigate();
    const [selectedServer, setSelectedServer] = useState("Alpha");
    const [adfreeServer, setAdfreeServer] = useState(true);
    const [autoPlay, setAutoPlay] = useState(false);
    const selectedServerModal = useRef("Alpha");

    videoCounter.current = 0;

    const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
    const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];

    let preparedVideoData = prepareVideoData(episodeDecoderData.videoUrlList);

    useEffect(() => {
        async function getAnimeDetails() {
            const [episodeAnimeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/decoder/${animeSlug}/${episodeNumber}/${selectedServer}`)]);
            const preparedVideoDataAjax = prepareVideoData(episodeAnimeAjaxData.data.videoUrlList);
            playerRef.current.src({
                type: preparedVideoDataAjax[0].type,
                src: preparedVideoDataAjax[0].link,
            });
            playerRef.current.videoUrlList = episodeAnimeAjaxData.data.videoUrlList;
            playerRef.current.shouldAjax = true;
            return;
        }
        if (!firstRender.current && !selectedServer.includes("_ad")) {
            getAnimeDetails();
        } else {
            firstRender.current = false;
        }
    }, [selectedServer]);

    const videoJsOptions = {
        controls: true,
        responsive: true,
        fluid: true,
        sources: {
            type: preparedVideoData[videoCounter.current].type,
            src: preparedVideoData[videoCounter.current].link,
        },
    };

    const openModal = () =>
        openConfirmModal({
            title: "Server Selector",
            children: (
                <Group>
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
        playerRef.current.animeDetails = episodeData.animeDetails;

        /**
         * Player Events
         */
        player.on("ready", async () => {
            window.player = player;
            player.hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableModifiersForNumbers: false,
            });
            const allSkipData = await getAnimeSkipData(episodeData.animeDetails, episodeNumber);
            player.overlay({
                overlays: allSkipData.map((skipData) => {
                    return {
                        start: skipData.startTime,
                        end: skipData.endTime,
                        content: `<div class="${classes.skipButtonInternalDiv}" onclick="window.player.currentTime(${skipData.endTime + 1})"><div class="${classes.skipButtonTextDiv}">${skipData.displayString}</div></div>`,
                        align: "bottom-right",
                        class: classes.skipButtonParentDiv,
                    };
                }),
            });
        });
        player.on("waiting", () => {
            console.log("player is waiting");
        });
        player.on("dispose", () => {
            console.log("player will dispose");
            clearInterval(player.watchTimeTracker);
        });
        player.on("ended", () => {
            console.log("player video ended");
            if (autoPlay && episodeData.animeDetails.episodes !== parseInt(episodeNumber)) {
                showNotification({
                    title: "Autoplay!",
                    message: "Next episode starting in 3 seconds",
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate(nextEpisodeUrl(animeSlug, parseInt(episodeNumber), episodeData.animeDetails.episodes));
                }, 3000);
            }
        });
        player.reloadSourceOnError({
            getSource: async (reload) => {
                console.log("Using another source!");
                const prepareVideoData = (videoData) => {
                    var videos_with_video_format = [];
                    for (const result of videoData) {
                        if (result.url.includes("mp4") || result.url.includes("m3u8")) {
                            videos_with_video_format.push({
                                link: getProxyUrl(result.url),
                                type: result.url.includes("m3u8") ? "application/x-mpegURL" : "video/mp4",
                                resolution: !result.url.includes("m3u8") && result.url.includes(".mp4") ? result?.res?.split(" ").join("") : "",
                                priority: result.url.includes("m3u8") && result.url.includes("gogoplay") ? 1 : 0,
                            });
                        }
                    }
                    videos_with_video_format.sort((b, a) => a.priority - b.priority);
                    return videos_with_video_format;
                };
                const getProxyUrl = (videoUrl) => {
                    var whitelist = ["v.vrv.co", "akamai", "midorii", "loadfast", "peliscdn", "gogocdn", "cache", "wix", document.location.hostname];
                    if (whitelist.some((link) => videoUrl.includes(link))) {
                        return videoUrl;
                    }
                    return "https://in.watchanime.dev/" + videoUrl;
                };

                let preparedVideoData = prepareVideoData(playerRef.current.videoUrlList);

                if (videoCounter.current >= preparedVideoData.length && playerRef.current?.shouldAjax) {
                    const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
                    const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];
                    const [episodeAnimeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/decoder/${animeSlug}/${episodeNumber}/${player.selectedServer}?invalidate_cache=true`)]);
                    preparedVideoData = prepareVideoData(episodeAnimeAjaxData.data.videoUrlList);
                    playerRef.current.videoUrlList = episodeAnimeAjaxData.data.videoUrlList;
                    playerRef.current.shouldAjax = false;
                    videoCounter.current = 0;
                }
                reload({
                    src: preparedVideoData[videoCounter.current].link,
                    type: preparedVideoData[videoCounter.current].type,
                });
                videoCounter.current = videoCounter.current + 1;
            },
            errorInterval: 0,
        });
        player.on("loadeddata", () => {
            console.log("player have loadeddata");
            let lastWatchedData = getLastWatchedData(episodeNumber);
            let lastWatchedTime = lastWatchedData.length && lastWatchedData.filter((lastWatched) => lastWatched.slug === animeSlug).length ? lastWatchedData.filter((lastWatched) => lastWatched.slug === animeSlug)[0].playBackData.playBackTime : 0;
            player.currentTime(lastWatchedTime);
            //Only set poster if no watchtime found
            if (lastWatchedTime === 0) {
                player.poster(episodeData.animeDetails.poster);
            }
            setLastWatchedQueue(animeSlug, episodeNumber);
            setWatchHistoryBySlug(episodeData.animeDetails, { duration: player.duration(), playBackTime: player.currentTime() }, episodeNumber);
            player.watchTimeTracker = setInterval(updatePlaybackInWathHistoryBySlug.bind(null, player, animeSlug, episodeNumber), 3000);
        });
        player.selectedServer = selectedServer;
        player.playsinline(true);
        initHlsSelector(player);
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
                            <Tooltip label={autoPlay ? "Disable Autoplay" : "Enable Autoplay"}>
                                <UnstyledButton onClick={() => setAutoPlay(!autoPlay)}>{autoPlay ? <IconDeviceTvOff size={14} /> : <IconDeviceTv size={14} />}</UnstyledButton>
                            </Tooltip>
                        </Group>
                    </Group>
                    {adfreeServer ? <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} data={episodeDecoderData} /> : <VideoScreenIframePartial iframeCollectionData={episodeData.sources.others} selectedServer={selectedServer} />}
                    <Group className={classes.videoDetailsDiv}>
                        <Group sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Title sx={{ fontSize: "20px", fontWeight: "400" }}>{getAnimeTitleByRelevance(episodeData.animeDetails.titles)}</Title>
                            <Button className={classes.changeServerButton} onClick={openModal}>
                                <IconSettings size={14} />
                                <Text sx={{ paddingLeft: "5px" }}>Change Server</Text>
                            </Button>
                        </Group>
                        <VideoScreenEpisodeDisplayPartial episodeCount={getEpisodeCount(episodeData.animeDetails)} animeSlug={animeSlug} currentEpisode={episodeNumber} />
                        <Divider sx={{ width: "100%", margin: "10px 0px" }} />
                        <Group sx={{ fontSize: "12px", flexDirection: "column", alignItems: "baseline", gap: "0px" }}>
                            <Group sx={{ gap: "5px" }}>
                                <Text>Genres:</Text>
                                <Text>{episodeData.animeDetails?.genres?.map((genre) => genre.name).join(", ")}</Text>
                            </Group>
                            <Group sx={{ gap: "5px" }}>
                                <Text>Status:</Text>
                                <Text>{episodeData.animeDetails.airing ? "Ongoing" : "Finished Airing"}</Text>
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
