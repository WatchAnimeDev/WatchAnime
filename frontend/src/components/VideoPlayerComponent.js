import { Button, createStyles, Divider, Group, Radio, Text, Title, UnstyledButton } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../constants/genricConstants";
import { getAnimeTitleByRelevance, nextEpisodeUrl, prepareVideoData, prevEpisodeUrl } from "../custom/AnimeData";
import VideoPlayer from "../player/VideoPlayer";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import { getLastWatchedData, initHlsSelector, setLastWatchedQueue, setWatchHistoryBySlug } from "../player/PlayerHelper";
import { IconBug, IconDownload, IconPlayerTrackNext, IconPlayerTrackPrev, IconSettings } from "@tabler/icons";
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
    const [selectedServer, setSelectedServer] = useState("Alpha");
    const [adfreeServer, setAdfreeServer] = useState(true);
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
        /**
         * Player Events
         */
        player.on("ready", () => {
            player.poster(episodeData.poster);
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
                    var whitelist = ["v.vrv.co", "akamai", "midorii", "loadfast", "peliscdn", document.location.hostname];
                    if (whitelist.some((link) => videoUrl.includes(link))) {
                        return videoUrl;
                    }
                    return "https://in.watchanime.dev/" + videoUrl;
                };

                let preparedVideoData = prepareVideoData(playerRef.current.videoUrlList);

                if (videoCounter.current >= preparedVideoData.length) {
                    const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
                    const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];
                    const [episodeAnimeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/decoder/${animeSlug}/${episodeNumber}/${player.selectedServer}?invalidate_cache=true`)]);
                    preparedVideoData = prepareVideoData(episodeAnimeAjaxData.data.videoUrlList);
                    playerRef.current.videoUrlList = episodeAnimeAjaxData.data.videoUrlList;
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
                            <Text>Internal Player</Text>
                        </Group>
                        <Group>
                            <UnstyledButton component={Link} to={prevEpisodeUrl(animeSlug, parseInt(episodeNumber))}>
                                <IconPlayerTrackPrev size={14} />
                            </UnstyledButton>
                            <UnstyledButton component={Link} to={nextEpisodeUrl(animeSlug, parseInt(episodeNumber), episodeData.animeDetails.episodes)}>
                                <IconPlayerTrackNext size={14} />
                            </UnstyledButton>
                            <UnstyledButton>
                                <IconDownload size={14} />
                            </UnstyledButton>
                            <UnstyledButton>
                                <IconBug size={14} />
                            </UnstyledButton>
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
                        <VideoScreenEpisodeDisplayPartial episodeCount={episodeData.animeDetails.episodes} animeSlug={animeSlug} currentEpisode={episodeNumber} />
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
