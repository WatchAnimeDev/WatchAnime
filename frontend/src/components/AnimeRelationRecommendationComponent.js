import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ANIME_SLIDER_GAP, ANIME_SLIDER_MOBILE_WIDTH, ANIME_SLIDER_WIDTH } from "../constants/cssConstants";
import { API_BASE_URL } from "../constants/genricConstants";
import AnimeRecommendationLoaderPartial from "../partials/AnimeRecommendationLoaderPartial";
import AnimeSectionComponent from "./AnimeSectionComponent";

function AnimeRelationRecommendationComponent({ animeData }) {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

    const location = useLocation();
    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [animeRecommendation, setAnimeRecommendation] = useState([]);

    useEffect(() => {
        async function getAnimeDetails() {
            setAjaxComplete(false);
            const animeSlug = location.pathname.split("/anime/")[1];
            const [animeRecommendationAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/anime/recommendation/${animeSlug}`)]);
            setAnimeRecommendation(animeRecommendationAjaxData.data);
            setAjaxComplete(true);
            return;
        }
        getAnimeDetails();
    }, [location.pathname]);

    const relatedData = [];
    for (const animeGroup of animeData.relations.map((anime) => anime?.entry)) {
        for (const anime of animeGroup) {
            relatedData.push(anime);
        }
    }

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
        sx: { width: "100%" },
    };

    return (
        <>
            {relatedData.length ? <AnimeSectionComponent sectionTitle={"RELATED ANIME"} sectionAnimeData={relatedData} hasViewMore={false} sliderConfig={animeSliderConfig} /> : ""}
            {ajaxComplete ? animeRecommendation.length ? <AnimeSectionComponent sectionTitle={"RECOMMENDED FOR YOU"} sectionAnimeData={animeRecommendation} hasViewMore={false} sliderConfig={animeSliderConfig} /> : "" : <AnimeRecommendationLoaderPartial />}
        </>
    );
}

export default AnimeRelationRecommendationComponent;
