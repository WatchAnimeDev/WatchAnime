import React, { useEffect, useRef, useState } from "react";
import SideBarComponent from "../components/SideBarComponent";
import AnimeSectionComponent from "../components/AnimeSectionComponent";
import { Container, createStyles, Loader, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { ANIME_SLIDER_GAP, ANIME_SLIDER_MOBILE_WIDTH, ANIME_SLIDER_WIDTH } from "../constants/cssConstants";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import ScheduleComponent from "../components/ScheduleComponent";
import { getHoursIn12HoursFormat, roundOffTime } from "../custom/DateTime";
import { showGenericCheckBoxNotification } from "../custom/Notification";
import HeaderVideoLayout from "../layouts/HeaderVideoLayout";
// import WatchListEditComponent from "../components/WatchListEditComponent";
import { useWatchListStore } from "../store/WatchListStore";
import { useShallow } from "zustand/react/shallow";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { MergeQueryObject } from "../graphql/graphqlQueries";
import { getLastWatched, openCloudSyncModal } from "../custom/CloudSync";
import AnimeCloudSyncComponent from "../components/AnimeCloudSyncComponent";

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
    const { watchListData } = useWatchListStore(useShallow((state) => ({ watchListData: state.watchListData, setWatchListData: state.setWatchListData })));

    const [promptInstall, setPromptInstall] = useState(null);

    const [lastWatchedData, setLastWatchedData] = useState([]);

    //for legacy syncs
    const [cloudSyncModalOpen, setCloudSyncModalOpen] = useState(false);
    const [cloudSyncModalText, setCloudSyncModalText] = useState("");
    const [cloudSyncPersentage, setCloudSyncPersentage] = useState(0);

    const { classes } = useStyles();

    useEffect(() => {
        async function getRecentlyReleasedAnimes() {
            const [mergeData, lastWatched] = await Promise.all([execGraphqlQuery(MergeQueryObject, { page: 1 }, 10), getLastWatched()]);
            setRecentlyReleasedAnimes(mergeData.data.data.Recent);
            let headerVideoData = mergeData.data.data.Popular.filter((anime) => anime?.trailer?.deliveryUrl);
            headerVideoData = headerVideoData.length ? headerVideoData : mergeData.data.data.Popular;
            const headerVideoIndex = Math.floor(Math.random() * headerVideoData.length);
            const doNotSync = localStorage.getItem("doNotSync");
            if (!doNotSync) {
                openCloudSyncModal(setCloudSyncModalOpen, setCloudSyncModalText, cloudSyncPersentage, setCloudSyncPersentage);
            }
            setHeaderVideoData({ data: headerVideoData[headerVideoIndex], index: headerVideoIndex });
            setPopularSeries(mergeData.data.data.Popular);
            setScheduleData(prepareScheduleData(mergeData.data.data.Schedule));
            setLastWatchedData(lastWatched);
            setAjaxComplete(true);
            return;
        }
        getRecentlyReleasedAnimes();
        // eslint-disable-next-line
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

    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [
            { label: "Recently Added", refs: executeTargetRefRecent },
            { label: "Popular", refs: executeTargetRefPopular },
            { label: "Install App", callBack: () => installPWA() },
            { label: "Cloud Sync", callBack: () => openCloudSyncModal(setCloudSyncModalOpen, setCloudSyncModalText, cloudSyncPersentage, setCloudSyncPersentage) },
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
                    <AnimeSectionComponent sectionTitle={"Last Watched"} sectionAnimeData={lastWatchedData} sliderConfig={animeSliderConfig} otherData={{ isDeletable: true, featureId: "lastWatched", isAddableToWatchList: true, setLastWatchedData }} />
                ) : (
                    <></>
                )}
                {watchListData.length ? (
                    <AnimeSectionComponent
                        sectionTitle={"WatchList"}
                        sectionAnimeData={watchListData}
                        sliderConfig={animeSliderConfig}
                        otherData={{ isDeletable: true, featureId: "watchList" }}
                        // actionComponent={<WatchListEditComponent watchListData={watchListData} setWatchListData={setWatchListData} />}
                    />
                ) : (
                    <></>
                )}
                <AnimeSectionComponent refProp={targetRefRecent} sectionTitle={"Recently Released"} sectionAnimeData={recentlyReleasedAnimes} hasViewMore={true} viewMoreLink={"/recent/1"} sliderConfig={animeSliderConfig} />
                <ScheduleComponent scheduleData={scheduleData} targetRefSchedule={otherData.targetRefSchedule} />
                <AnimeSectionComponent refProp={targetRefPopular} sectionTitle={"Popular Series"} sectionAnimeData={popularSeries} hasViewMore={true} viewMoreLink={"/popular/1"} sliderConfig={animeSliderConfig} otherData={{ isAddableToWatchList: true }} />
            </Container>
            <AnimeCloudSyncComponent cloudSyncModalOpen={cloudSyncModalOpen} cloudSyncPersentage={cloudSyncPersentage} cloudSyncModalText={cloudSyncModalText} />
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default HomeScreen;
