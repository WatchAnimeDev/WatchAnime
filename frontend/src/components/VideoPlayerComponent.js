import { Button, createStyles, Divider, Group, Text, Title, UnstyledButton } from "@mantine/core";
import axios from "axios";
import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../constants/genricConstants";
import { getAnimeTitleByRelevance, prepareVideoData } from "../custom/AnimeData";
import VideoPlayer from "../player/VideoPlayer";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import { getLastWatchedData, initHlsSelector, setLastWatchedQueue, setWatchHistoryBySlug } from "../player/PlayerHelper";
import { IconBug, IconDownload, IconPlayerTrackNext, IconPlayerTrackPrev, IconSettings } from "@tabler/icons";
import { WATCHANIME_RED } from "../constants/cssConstants";

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

function VideoPlayerComponent({ episodeData, episodeDecoderData, selectedServer }) {
    const { classes } = useStyles();
    const playerRef = useRef(null);
    const videoCounter = useRef(0);
    const videoPlaybackRef = useRef();
    const location = useLocation();

    const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
    const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];

    let preparedVideoData = prepareVideoData(episodeDecoderData.videoUrlList);

    videoCounter.current = 0;

    const videoJsOptions = {
        controls: true,
        responsive: true,
        fluid: true,
        sources: {
            type: preparedVideoData[videoCounter.current].type,
            src: preparedVideoData[videoCounter.current].link,
        },
    };

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
            clearInterval(videoPlaybackRef.current);
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
                    return "https://in.watchanime.dev" + videoUrl;
                };

                if (videoCounter.current >= preparedVideoData.length) {
                    const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
                    const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];
                    const [episodeAnimeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/decoder/${animeSlug}/${episodeNumber}/${player.selectedServer}?invalidate_cache=true`)]);
                    preparedVideoData = prepareVideoData(episodeAnimeAjaxData.data.videoUrlList);
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
            console.log("loadeddata");
            let lastWatchedData = getLastWatchedData();
            let lastWatchedTime = lastWatchedData.length && lastWatchedData.filter((lastWatched) => lastWatched.slug === animeSlug).length ? lastWatchedData.filter((lastWatched) => lastWatched.slug === animeSlug)[0].playBackData.playBackTime : 0;
            player.currentTime(lastWatchedTime);
            setLastWatchedQueue(animeSlug, episodeNumber);
            setWatchHistoryBySlug(episodeData.animeDetails, { duration: player.duration(), playBackTime: player.currentTime() }, episodeNumber);
            videoPlaybackRef.current = setInterval(updatePlaybackInWathHistoryBySlug.bind(null, player, animeSlug, episodeNumber), 3000);
        });
        player.selectedServer = selectedServer;
        player.playsinline(true);
        initHlsSelector(player);
        player.videoUrlList = preparedVideoData;
    };

    return (
        <>
            <Group pt={"80px"} sx={{ width: "100%", justifyContent: "center" }}>
                <Group className={classes.parentPlayerDiv}>
                    <Group sx={{ backgroundColor: "#353738", width: "100%", fontSize: "14px", padding: "0px 10px", justifyContent: "space-between" }}>
                        <Group sx={{ gap: "5px" }}>
                            <Text>EP {episodeNumber}</Text>
                            <Divider orientation="vertical" />
                            <Text>Internal Player</Text>
                        </Group>
                        <Group>
                            <IconPlayerTrackPrev size={14} />
                            <IconPlayerTrackNext size={14} />
                            <IconDownload size={14} />
                            <IconBug size={14} />
                        </Group>
                    </Group>
                    <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
                    <Group className={classes.videoDetailsDiv}>
                        <Group sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Title sx={{ fontSize: "20px", fontWeight: "400" }}>{getAnimeTitleByRelevance(episodeData.animeDetails.titles)}</Title>
                            <Button className={classes.changeServerButton}>
                                <IconSettings size={14} />
                                <Text sx={{ paddingLeft: "5px" }}>Change Server</Text>
                            </Button>
                        </Group>
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
