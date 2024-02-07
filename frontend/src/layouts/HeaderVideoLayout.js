import { Button, createStyles, Group, Image, Paper, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendarTime, IconPlayerPlay, IconStar, IconVolume, IconVolumeOff } from "@tabler/icons";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HEADER_VIDEO_CONTAINER_HEIGHT, HEADER_VIDEO_CONTAINER_HEIGHT_MIN } from "../constants/cssConstants";
import { getAnimeTitleByRelevance, getImageByRelevance, getTmdbImageByRelevanceAndType, hasTmdbData } from "../custom/AnimeData";

import topTenImage from "../assets/images/topten.svg";
import { isVideoHeaderEnabled, toggleVideoVolume } from "../custom/VideoBackground";
import { useLanguageStore } from "../store/LanguageToggleStore";
import { useShallow } from "zustand/react/shallow";

const useStyles = createStyles((theme) => ({
    sliderButton: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",

        "&:hover": {
            backgroundColor: "rgba(255,255,255,0.2)",
            border: `1px solid rgba(255,255,255,0.4)`,
        },
    },
    sliderText: {
        display: "flex",
        position: "absolute",
        top: "20%",
        left: "2em",
        width: "50%",
        minHeight: "fit-content",
        padding: "1em",
        zIndex: "3",
        flexDirection: "column",
        height: "50%",
        justifyContent: "center",
        color: "rgba(255,255,255,0.9)",
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: "90%",
        },
    },
    sliderImageDiv: {
        backgroundSize: "cover",
        height: "100%",
        opacity: 0.5,
    },
    sliderFade: {
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "70%",
        zIndex: "1",
        background: "linear-gradient(0deg,#1A1B1E,transparent)",
        opacity: ".9",
        borderRadius: "0",
    },
    scrollFade: {
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "1",
        background: "#1A1B1E",
        opacity: "0",
        borderRadius: "0",
    },
    logoImageDiv: {
        objectPosition: "left",
        color: "red",
        objectFit: "scale-down",
        marginBottom: "10px",
    },
    logoDivAnimate: {
        objectPosition: "left",
        objectFit: "scale-down",
        marginBottom: "10px",
        transformOrigin: "left bottom",
        transform: "scale(1) translate3d(0px, 25%, 0px)",
        transitionDuration: "1300ms",
        transitionDelay: "5000ms",
    },
    synopsisDivAnimate: {
        opacity: "0",
        transitionDuration: "1000ms",
        transitionDelay: "5000ms",
        transform: "translate3d(0px, 150px, 0px)",
    },
    ratingAndAiringDivAnimate: {
        opacity: "0",
        transitionDuration: "1000ms",
        transitionDelay: "5000ms",
        transform: "translate3d(0px, 150px, 0px)",
    },
    topTenDivAnimate: {
        opacity: "0",
        transitionDuration: "1000ms",
        transitionDelay: "5000ms",
        transform: "translate3d(0px, 150px, 0px)",
    },
    divReAnimate: {
        opacity: "1",
        transitionDuration: "1000ms",
        transitionDelay: "1000ms",
        transform: "translate3d(0px, 0px, 0px)",
    },
    logoDivReAnimate: {
        objectPosition: "left",
        objectFit: "scale-down",
        marginBottom: "10px",
        transformOrigin: "left bottom",
        transform: "scale(1) translate3d(0px, 0%, 0px)",
        transitionDuration: "1000ms",
        transitionDelay: "1000ms",
    },
    synopsisDivHide: {
        display: "none",
    },
    ratingAndAiringDivHide: {
        display: "none !important",
    },
    topTenDivHide: {
        display: "none !important",
    },
    videoBackgroundClass: {
        position: "absolute",
        right: "0",
        bottom: "0",
        width: "100% !important",
        objectFit: "cover",
        height: HEADER_VIDEO_CONTAINER_HEIGHT,
        transition: "opacity 1s linear",
        minHeight: HEADER_VIDEO_CONTAINER_HEIGHT_MIN,
    },
    headerMuteButton: {
        width: "50px",
        height: "50px",
        position: "absolute",
        right: "5%",
        bottom: "35%",
        borderRadius: "40px",
        backgroundColor: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        color: "white",
        zIndex: "3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
            backgroundColor: "rgba(255,255,255,0.1)",
        },
    },
}));

function HeaderVideoLayout({ anime, index }) {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
    const videoPlayerRef = useRef(HTMLVideoElement);
    // const isHeaderVideoEnable = isVideoHeaderEnabled(anime, mobile);
    const [logoClassArray, setLogoClassArray] = useState(classes.logoImageDiv);
    const [synopsisClassArray, setSynopsisClassArray] = useState("");
    const [ratingAndAiringClassArray, setRatingAndAiringClassArray] = useState("");
    const [topTenClassArray, setTopTenClassArrayClassArray] = useState("");
    const [scrollFactor, setScrollFactor] = useState(0);
    const [videoMuted, setVideoMuted] = useState(true);
    const [isHeaderVideoVisible, setIsHeaderVideoVisible] = useState(isVideoHeaderEnabled(anime, mobile));
    const { language } = useLanguageStore(useShallow((state) => ({ language: state.language })));

    useEffect(() => {
        setIsHeaderVideoVisible(isVideoHeaderEnabled(anime, mobile));
    }, [mobile, anime]);

    useEffect(() => {
        setLogoClassArray(classes.logoDivAnimate);
        setSynopsisClassArray(classes.synopsisDivAnimate);
        setRatingAndAiringClassArray(classes.ratingAndAiringDivAnimate);
        setTopTenClassArrayClassArray(classes.topTenDivAnimate);
        videoPlayerRef.current.onended = () => {
            setLogoClassArray(classes.logoDivReAnimate);
            setSynopsisClassArray(classes.divReAnimate);
            setRatingAndAiringClassArray(classes.divReAnimate);
            setTopTenClassArrayClassArray(classes.divReAnimate);
            setIsHeaderVideoVisible(false);
            videoPlayerRef.current.classList.add("opacityhide");
        };
    }, [classes.logoDivAnimate, classes.synopsisDivAnimate, classes.ratingAndAiringDivAnimate, classes.topTenDivAnimate, classes.synopsisDivHide, classes.ratingAndAiringDivHide, classes.topTenDivHide, classes.divReAnimate, classes.logoDivReAnimate]);

    useEffect(() => {
        const headerVideoFadeHandler = () => {
            const scrollFactorCalculated = 1 - Math.max(0, window.innerHeight - document.documentElement.scrollTop) / window.innerHeight;
            setScrollFactor(scrollFactorCalculated);
            if (videoPlayerRef.current?.classList && !videoPlayerRef.current.classList.contains("opacityhide")) {
                videoPlayerRef.current.volume = Math.max(0, 1 - scrollFactorCalculated * 1.3);
                scrollFactorCalculated > 0.7 ? videoPlayerRef.current.pause() : videoPlayerRef.current.play();
            }
        };

        window.addEventListener("scroll", headerVideoFadeHandler);
        return () => window.removeEventListener("scroll", headerVideoFadeHandler);
    }, []);

    return (
        <Paper sx={{ height: HEADER_VIDEO_CONTAINER_HEIGHT, position: "absolute", width: "100%", minHeight: HEADER_VIDEO_CONTAINER_HEIGHT_MIN }} className="slider-slide">
            <Paper
                className={classes.sliderImageDiv}
                sx={{
                    backgroundImage: `url("${
                        mobile ? getImageByRelevance(anime.images, "large_image_url") : hasTmdbData(anime) ? getTmdbImageByRelevanceAndType(anime.tmdbData) : anime.bannerImage ? anime.bannerImage : getImageByRelevance(anime.images, "image_url")
                    }")`,
                }}
            ></Paper>
            {isHeaderVideoVisible ? <video ref={videoPlayerRef} className={classes.videoBackgroundClass} id="vjs_video_3_html5_api" autoPlay src={anime.trailer.deliveryUrl} playsInline muted></video> : ""}
            <div className={classes.sliderText}>
                <Group className={topTenClassArray} display={"flex"} mb={"xs"} sx={{ gap: 10 }}>
                    <Image src={topTenImage} width={32} height={32}></Image>
                    <Text size={18}>{`#${index + 1} ${anime.type ? `in ${anime.type} shows today` : "Trending"}`}</Text>
                </Group>
                <Group className={ratingAndAiringClassArray} sx={{ fontSize: 16 }} mb={"xs"}>
                    <Group spacing={2}>
                        <IconStar size={16} stroke={1.5} />
                        <Text>{anime.score}</Text>
                    </Group>
                    <Group spacing={2}>
                        <IconCalendarTime size={16} stroke={1.5} />
                        <Text>{anime.aired.string.toString().split("to")[0]}</Text>
                    </Group>
                </Group>
                {!hasTmdbData(anime) || mobile ? (
                    <Text lineClamp={1} size={56} lh={1.2} mb={"xs"}>
                        {getAnimeTitleByRelevance(anime.titles, false, language)}
                    </Text>
                ) : (
                    <img src={getTmdbImageByRelevanceAndType(anime.tmdbData, "logos")} width="500" height="150" className={logoClassArray} alt="" />
                )}

                <Text lineClamp={2} size={16} className={synopsisClassArray}>{`Plot Summary: ${anime.synopsis}`}</Text>
                <Button fullWidth={false} size={"md"} sx={{ width: "fit-content", marginTop: "15px", padding: "10px 50px" }} radius={8} className={classes.sliderButton} component={Link} to={`/anime/${anime.slug}`}>
                    <IconPlayerPlay size={16} stroke={1.5} />
                    <Text sx={{ marginLeft: "5px" }}>Play</Text>
                </Button>
            </div>
            <Paper className={classes.sliderFade}></Paper>
            <Paper className={classes.scrollFade} sx={{ opacity: scrollFactor * 1.5 }}></Paper>
            {isHeaderVideoVisible ? (
                <Paper className={classes.headerMuteButton} onClick={(e) => toggleVideoVolume(videoMuted, setVideoMuted, videoPlayerRef)}>
                    {videoMuted ? <IconVolumeOff size={24} stroke={1.5} /> : <IconVolume size={24} stroke={1.5} />}
                </Paper>
            ) : (
                ``
            )}
        </Paper>
    );
}

export default HeaderVideoLayout;
