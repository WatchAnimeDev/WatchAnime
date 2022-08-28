import { Group, Text } from "@mantine/core";
import axios from "axios";
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../constants/genricConstants";
import { prepareVideoData } from "../custom/AnimeData";
import VideoPlayer from "../player/VideoPlayer";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import { getLastWatchedData, initHlsSelector, setLastWatchedQueue, setWatchHistoryBySlug } from "../player/PlayerHelper";

const updatePlaybackInWathHistoryBySlug = (player, slug, episodeNumber) => {
    setWatchHistoryBySlug({ slug: slug }, { duration: player.duration(), playBackTime: player.currentTime() }, episodeNumber);
};

function VideoPlayerComponent({ episodeData, episodeDecoderData, selectedServer }) {
    const playerRef = useRef(null);
    const videoCounter = useRef(0);
    const videoPlaybackRef = useRef();
    const location = useLocation();

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
            const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
            const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];
            let lastWatchedData = getLastWatchedData();
            player.currentTime(lastWatchedData.filter((lastWatched) => lastWatched.slug === animeSlug)[0].playBackData.playBackTime);
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
                <Group sx={{ height: "500px", width: "100%", maxWidth: "900px" }}>
                    <Text>Hello</Text>
                    <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
                    <Text>World</Text>
                </Group>
            </Group>
        </>
    );
}

export default VideoPlayerComponent;
