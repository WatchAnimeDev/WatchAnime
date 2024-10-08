import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ANIME_SLIDER_GAP, ANIME_SLIDER_MOBILE_WIDTH, ANIME_SLIDER_WIDTH } from "../constants/cssConstants";
import { API_BASE_URL } from "../constants/genricConstants";
import AnimeSectionLoaderPartial from "../partials/AnimeSectionLoaderPartial";
import AnimeSectionComponent from "./AnimeSectionComponent";

function AnimeRecommendationComponent({ malId }) {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [animeRecommendation, setAnimeRecommendation] = useState([]);

    useEffect(() => {
        async function getAnimeDetails() {
            setAjaxComplete(false);
            const [animeRecommendationAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/anime/recommendation/${malId}`)]);
            setAnimeRecommendation(animeRecommendationAjaxData.data);
            setAjaxComplete(true);
            return;
        }
        getAnimeDetails();
    }, [malId]);

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

    return (
        <>
            {ajaxComplete ? (
                animeRecommendation.length ? (
                    <AnimeSectionComponent sectionTitle={"RECOMMENDED FOR YOU"} sectionAnimeData={animeRecommendation} hasViewMore={false} sliderConfig={animeSliderConfig} />
                ) : (
                    ""
                )
            ) : (
                <AnimeSectionLoaderPartial loaderTitle={"RECOMMENDED FOR YOU"} skeletonHeight={260} skeletonWidth={200} />
            )}
        </>
    );
}

export default AnimeRecommendationComponent;
