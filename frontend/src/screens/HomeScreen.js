import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import SliderComponent from "../components/SliderComponent";
import { API_BASE_URL } from "../constants/genricConstants";
import SideBarComponent from "../components/SideBarComponent";
import AnimeSectionComponent from "../components/AnimeSectionComponent";
import { Container, createStyles, Loader, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { ANIME_SLIDER_GAP, ANIME_SLIDER_MOBILE_WIDTH, ANIME_SLIDER_WIDTH, SLIDER_HEIGHT } from "../constants/cssConstants";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
const useStyles = createStyles((theme) => ({
    bodyContainer: {
        margin: "20px 30px",
        [theme.fn.smallerThan("md")]: {
            margin: "20px 10px",
        },
    },
}));
function HomeScreen({ sideBarState, setSideBarState }) {
    const targetRefRecent = useRef(null);
    const targetRefPopular = useRef(null);

    const executeTargetRefRecent = () => targetRefRecent.current.scrollIntoView();
    const executeTargetRefPopular = () => targetRefPopular.current.scrollIntoView();

    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [recentlyReleasedAnimes, setRecentlyReleasedAnimes] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [sliderAnimes, setSliderAnimes] = useState([]);
    const [popularSeries, setPopularSeries] = useState([]);
    const { classes } = useStyles();

    useEffect(() => {
        async function getRecentlyReleasedAnimes() {
            const [popularData, recentlyReleasedData, scheduleData] = await Promise.all([axios.get(`${API_BASE_URL}/popular/1`), axios.get(`${API_BASE_URL}/recent/1`, axios.get(`https://apitest.watchanime.dev/schedule`))]);
            setRecentlyReleasedAnimes(recentlyReleasedData.data);
            setSliderAnimes(popularData.data.slice(0, 10));
            setPopularSeries(popularData.data);
            setScheduleData(scheduleData);
            setAjaxComplete(true);
            return;
        }
        getRecentlyReleasedAnimes();
    }, []);
    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Recently Added", refs: executeTargetRefRecent }, { label: "Popular", refs: executeTargetRefPopular }, { label: "Random" }, { label: "Report a Problem" }, { label: "Install App" }],
    };
    const headerSliderConfig = {
        withIndicators: true,
        height: SLIDER_HEIGHT,
        loop: true,
        withControls: false,
    };
    const animeSliderConfig = {
        slideSize: mobile ? ANIME_SLIDER_MOBILE_WIDTH : ANIME_SLIDER_WIDTH,
        slideGap: ANIME_SLIDER_GAP,
        align: "start",
        includeGapInSize: false,
        dragFree: true,
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
    };
    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} />
            <SliderComponent sliderDatas={sliderAnimes} sliderRenderComponent={"HeaderSliderLayout"} sliderConfig={headerSliderConfig} />
            <Container fluid className={classes.bodyContainer}>
                <AnimeSectionComponent refProp={targetRefRecent} sectionTitle={"Recently Released"} sectionAnimeData={recentlyReleasedAnimes} hasViewMore={true} viewMoreLink={"/recent"} sliderConfig={animeSliderConfig} />
                <AnimeSectionComponent refProp={targetRefPopular} sectionTitle={"Popular Series"} sectionAnimeData={popularSeries} hasViewMore={true} viewMoreLink={"/popular"} sliderConfig={animeSliderConfig} />
            </Container>
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default HomeScreen;
