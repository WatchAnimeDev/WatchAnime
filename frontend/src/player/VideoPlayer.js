import React from "react";
import Artplayer from "artplayer";
import Hls from "hls.js/dist/hls.min";
import dashjs from "dashjs";
import artplayerPluginHlsQuality from "./plugins/HlsQuality";
import { createStyles } from "@mantine/core";
import artplayerPluginDashQuality from "./plugins/DashQuality";

const useStyles = createStyles((theme) => ({
    parentPlayerDiv: { padding: "0", position: "relative", verticalAlign: "top", wordBreak: "normal", maxWidth: "100%", width: "100%", height: "0", paddingTop: "56.25%" },
    playerDiv: { left: "0", position: "absolute", top: "0", height: "100%", width: "100%" },
}));

export const VideoPlayer = ({ option, onReady, ...rest }) => {
    const { classes } = useStyles();
    const artRef = React.useRef(null);

    React.useEffect(() => {
        window.hls = {};
        const art = new Artplayer({
            container: artRef.current,
            setting: true,
            fullscreen: true,
            playbackRate: true,
            mutex: true,
            aspectRatio: true,
            playsInline: true,
            subtitle: {
                ...(Object.keys(option.subtitles).length
                    ? {
                          url: option.subtitles.url,
                          type: option.subtitles.type,
                          encoding: "utf-8",
                          escape: false,
                          onVttLoad: (sub) => {
                              return sub;
                          },
                      }
                    : {}),
                style: {
                    fontSize: "2em",
                },
            },
            plugins: [
                ...[
                    option.url.includes("m3u8")
                        ? artplayerPluginHlsQuality({
                              // Show quality in control
                              control: true,
                              // Get the resolution text from level
                              getResolution: (level) => level.height + "P",

                              // I18n
                              title: "Quality",
                          })
                        : [],
                ],
                ...[
                    option.url.includes("mpd")
                        ? artplayerPluginDashQuality({
                              // Show quality in control
                              control: true,

                              // Get the resolution text from level
                              getResolution: (level) => level.height + "P",

                              // I18n
                              title: "Quality",
                          })
                        : [],
                ],
            ],
            customType: {
                m3u8: function playM3u8(video, url, art) {
                    if (Hls.isSupported()) {
                        if (art.hls) art.hls.destroy();
                        const hls = new Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                        art.hls = hls;
                        art.on("destroy", () => hls.destroy());
                    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = url;
                    } else {
                        art.notice.show = "Unsupported playback format: m3u8";
                    }
                },
                mpd: function playMpd(video, url, art) {
                    if (dashjs.supportsMediaSource()) {
                        if (art.dash) art.dash.destroy();
                        const dash = dashjs.MediaPlayer().create();
                        dash.initialize(video, url, art.option.autoplay);
                        art.dash = dash;
                        art.on("destroy", () => dash.destroy());
                    } else {
                        art.notice.show = "Unsupported playback format: mpd";
                    }
                },
            },
            settings: [
                {
                    html: "Subtitle Size",
                    tooltip: "16px",
                    range: [16, 10, 50, 1], // Min 10px, Max 40px, Step 1px
                    onRange: function (item) {
                        const fontSize = item.range + "px";
                        document.querySelector(".art-subtitle").style.fontSize = fontSize;
                        return fontSize;
                    },
                },
            ],
            ...option,
        });
        if (onReady && typeof onReady === "function") {
            onReady(art);
        }

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div data-vjs-player className={classes.parentPlayerDiv}>
            <div ref={artRef} className={classes.playerDiv} />
        </div>
    );
};

function fetchAndMergeSubtitles(text) {
    let subtitles = [];
    let lines = text.split("\n");
    let temp = [];

    for (let line of lines) {
        if (line.trim() === "") {
            if (temp.length > 0 && temp.length > 1) {
                subtitles.push(temp);
            }
            if (temp.length > 0) {
                temp = [];
            }
        } else {
            temp.push(line);
        }
    }
    if (temp.length > 0) subtitles.push(temp);

    let mergedSubtitles = mergeOverlapping(subtitles);
    return mergedSubtitles;
}

function mergeOverlapping(subtitles) {
    let result = [];

    for (let i = 0; i < subtitles.length; i++) {
        let current = subtitles[i];
        let next = subtitles[i + 1] || [];

        let currentTime = current[0].split(" --> ");
        let nextTime = next[0] ? next[0].split(" --> ") : null;

        if (nextTime && parseTime(currentTime[1]) > parseTime(nextTime[0])) {
            // Merge text if times overlap
            let mergedText = current.slice(1).join("\n") + "\n" + next.slice(1).join("\n");
            result.push([currentTime[0] + " --> " + nextTime[1], mergedText]);
            i++; // Skip next subtitle since it's merged
        } else {
            result.push([current[0], current.slice(1).join("\n")]);
        }
    }

    return result.map((sub) => sub.join("\n")).join("\n\n");
}

function parseTime(time) {
    let parts = time.split(":");
    let seconds = parseFloat(parts[2]);
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + seconds;
}

export default VideoPlayer;
