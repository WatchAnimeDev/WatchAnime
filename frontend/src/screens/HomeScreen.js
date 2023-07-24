import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants/genricConstants";
import SideBarComponent from "../components/SideBarComponent";
import AnimeSectionComponent from "../components/AnimeSectionComponent";
import { Container, createStyles, Loader, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { ANIME_SLIDER_GAP, ANIME_SLIDER_MOBILE_WIDTH, ANIME_SLIDER_WIDTH } from "../constants/cssConstants";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import ScheduleComponent from "../components/ScheduleComponent";
import { getHoursIn12HoursFormat, roundOffTime } from "../custom/DateTime";
import { getLastWatchedData } from "../player/PlayerHelper";
import { getWatchListAllData, replaceAllWatchListData } from "../custom/WatchList";
import { showGenericCheckBoxNotification } from "../custom/Notification";
import HeaderVideoLayout from "../layouts/HeaderVideoLayout";

const useStyles = createStyles((theme) => ({
    bodyContainer: {
        margin: "20px 30px",
        paddingTop: "max(35%, 500px)",
        position: "relative",
        zIndex: 1,
        marginTop: 0,
        [theme.fn.smallerThan("md")]: {
            margin: "20px 10px",
            marginTop: 0,
        },
    },
}));

const prepareScheduleData = (scheduleData = []) => {
    scheduleData.forEach((schedule, index, scheduleData) => {
        const tempDate = dateSchedule(Number(schedule.time) + 7200);
        scheduleData[index].timeday = tempDate.time;
        scheduleData[index].daynum = tempDate.daynum;
    });
    scheduleData.sort((first, second) => {
        return first.timeday < second.timeday ? -1 : first.timeday > second.timeday ? 1 : 0;
    });
    return scheduleData;
};

const dateSchedule = (timeStamp) => {
    const currentDate = new Date(timeStamp * 1000);
    return {
        daynum: currentDate.getDay(),
        time: `${roundOffTime(getHoursIn12HoursFormat(currentDate.getHours()))}:${roundOffTime(currentDate.getMinutes())} ${currentDate.getHours() >= 12 ? "PM" : "AM"}`,
    };
};

function HomeScreen({ sideBarState, setSideBarState, bugReportState, setBugReportState, otherData }) {
    const targetRefRecent = useRef(null);
    const targetRefPopular = useRef(null);

    const executeTargetRefRecent = () => targetRefRecent.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    const executeTargetRefPopular = () => targetRefPopular.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [recentlyReleasedAnimes, setRecentlyReleasedAnimes] = useState([]);

    const [scheduleData, setScheduleData] = useState([]);
    const [headerVideoData, setHeaderVideoData] = useState({});
    const [popularSeries, setPopularSeries] = useState([]);
    const [watchListData, setWatchListData] = useState(getWatchListAllData());

    const [promptInstall, setPromptInstall] = useState(null);

    const lastWatchedData = getLastWatchedData();

    const [reRenderHomepage, setReRenderHomepage] = useState(false);

    const { classes } = useStyles();

    useEffect(() => {
        async function getRecentlyReleasedAnimes() {
            const [popularData, recentlyReleasedData, scheduleData] = await Promise.all([axios.get(`${API_BASE_URL}/popular/1`), axios.get(`${API_BASE_URL}/recent/1`), axios.get(`${API_BASE_URL}/schedule`)]);
            setRecentlyReleasedAnimes(recentlyReleasedData.data);
            let headerVideoData = popularData.data.filter((anime) => anime?.trailer?.deliveryUrl);
            headerVideoData = headerVideoData.length ? headerVideoData : popularData.data;
            const headerVideoIndex = Math.floor(Math.random() * headerVideoData.length);
            setHeaderVideoData({ data: headerVideoData[headerVideoIndex], index: headerVideoIndex });
            setPopularSeries(popularData.data);
            setScheduleData(prepareScheduleData(scheduleData.data));
            setAjaxComplete(true);
            return;
        }
        getRecentlyReleasedAnimes();
    }, []);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setPromptInstall(e);
        };
        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("transitionend", handler);
    }, []);

    const installPWA = () => {
        if (!promptInstall) {
            showGenericCheckBoxNotification("Install Failed", "Failed to install PWA.", { color: "red" });
            return;
        }
        promptInstall.prompt();
    };

    useEffect(() => {
        async function getLatestEpisodeInfoForWatchlist() {
            const [latestEpisodeInfo] = await Promise.all([
                axios.post(`${API_BASE_URL}/anime/episode/latest`, {
                    slugs: watchListData.filter((anime) => anime.airing || anime.status === "Not yet aired").map((anime) => anime.slug),
                }),
            ]);
            for (let animeIndex = 0; animeIndex < watchListData.length; animeIndex++) {
                if (latestEpisodeInfo.data[watchListData[animeIndex].slug]) {
                    watchListData[animeIndex].releasedEpisodes = latestEpisodeInfo.data[watchListData[animeIndex].slug].episode;
                    watchListData[animeIndex].airing = latestEpisodeInfo.data[watchListData[animeIndex].slug].airing;
                    watchListData[animeIndex].status = latestEpisodeInfo.data[watchListData[animeIndex].slug].status;
                }
            }
            replaceAllWatchListData(watchListData);
            setWatchListData([...watchListData]);
            return;
        }
        if (!watchListData.length) {
            return;
        }
        getLatestEpisodeInfoForWatchlist();
        // eslint-disable-next-line
    }, []);

    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [
            { label: "Recently Added", refs: executeTargetRefRecent },
            { label: "Popular", refs: executeTargetRefPopular },
            { label: "Install App", callBack: () => installPWA() },
        ],
    };
    const animeSliderConfig = {
        slideSize: mobile ? ANIME_SLIDER_MOBILE_WIDTH : ANIME_SLIDER_WIDTH,
        slideGap: ANIME_SLIDER_GAP,
        align: "start",
        includeGapInSize: false,
        skipSnaps: true,
        styles: {
            control: {
                backgroundColor: "rgb(37, 38, 43)",
                fontSize: "18px",
                width: "40px",
                height: "40px",
                lineHeight: "40px",
                textAlign: "center",
                borderRadius: "6px",
                margin: "3px 0px",
                opacity: 1,
                color: "white",
                border: "0px",
                "&:hover": {
                    backgroundColor: "rgba(44, 46, 51, 0.85)",
                },
            },
        },
        nextControlIcon: <IconChevronRight size={20} stroke={1.5} />,
        previousControlIcon: <IconChevronLeft size={20} stroke={1.5} />,
        sx: { width: "100%" },
        containScroll: "keepSnaps",
    };
    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ bugReportState, setBugReportState }} />
            <HeaderVideoLayout anime={headerVideoData.data} index={headerVideoData.index} />
            <Container fluid className={[classes.bodyContainer, "main-wrapper"]}>
                {lastWatchedData.length ? (
                    <AnimeSectionComponent
                        sectionTitle={"Last Watched"}
                        sectionAnimeData={lastWatchedData}
                        sliderConfig={animeSliderConfig}
                        otherData={{ isDeletable: true, reRenderHomepage: reRenderHomepage, setReRenderHomepage: setReRenderHomepage, featureId: "lastWatched", isAddableToWatchList: true }}
                    />
                ) : (
                    <></>
                )}
                {watchListData.length ? (
                    <AnimeSectionComponent
                        sectionTitle={"WatchList"}
                        sectionAnimeData={watchListData}
                        sliderConfig={animeSliderConfig}
                        otherData={{ isDeletable: true, reRenderHomepage: reRenderHomepage, setReRenderHomepage: setReRenderHomepage, featureId: "watchList" }}
                    />
                ) : (
                    <></>
                )}
                <AnimeSectionComponent refProp={targetRefRecent} sectionTitle={"Recently Released"} sectionAnimeData={recentlyReleasedAnimes} hasViewMore={true} viewMoreLink={"/recent/1"} sliderConfig={animeSliderConfig} />
                <ScheduleComponent scheduleData={scheduleData} targetRefSchedule={otherData.targetRefSchedule} />
                <AnimeSectionComponent refProp={targetRefPopular} sectionTitle={"Popular Series"} sectionAnimeData={popularSeries} hasViewMore={true} viewMoreLink={"/popular/1"} sliderConfig={animeSliderConfig} otherData={{ isAddableToWatchList: true }} />
            </Container>
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default HomeScreen;
