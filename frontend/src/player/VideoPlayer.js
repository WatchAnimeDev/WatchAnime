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
                              auto: "1080",
                          })
                        : [],
                ],
                ...[
                    option.url.includes("mpd")
                        ? artplayerPluginDashQuality({
                              // Show quality in control
                              control: true,

                              // Show quality in setting
                              setting: true,

                              // Get the resolution text from level
                              getResolution: (level) => level.height + "P",

                              // I18n
                              title: "Quality",
                              auto: "1080",
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

export default VideoPlayer;
