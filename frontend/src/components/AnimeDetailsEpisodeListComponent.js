import { Group, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ANIME_SLIDER_GAP } from "../constants/cssConstants";
import { API_BASE_URL } from "../constants/genricConstants";
import AnimeSectionLoaderPartial from "../partials/AnimeSectionLoaderPartial";
import SliderComponent from "./SliderComponent";

function AnimeDetailsEpisodeListComponent({ animeData, episodeInfoData, setEpisodeInfoData }) {
    const [ajaxComplete, setAjaxComplete] = useState(false);

    useEffect(() => {
        async function getEpisodeInfoData() {
            setAjaxComplete(false);
            const [animeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/details/${animeData.slug}/all`)]);
            setEpisodeInfoData(animeAjaxData.data);
            setAjaxComplete(true);
            return;
        }
        getEpisodeInfoData();
    }, [animeData.slug, setEpisodeInfoData]);

    const sliderConfig = {
        slideSize: 300, //mobile
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
                episodeInfoData.episodes?.length ? (
                    <Group sx={{ width: "100%", marginBottom: "30px", height: "300px" }}>
                        <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                            <Text sx={{ fontSize: "20px", fontWeight: "700" }}>{"EPISODE LIST"}</Text>
                        </Group>
                        {episodeInfoData.episodes ? <SliderComponent sliderDatas={episodeInfoData.episodes.slice(0, 20)} sliderRenderComponent={"AnimeDetailsEpisodeListLayout"} sliderConfig={sliderConfig} otherData={{ animeSlug: animeData.slug }} /> : ""}
                    </Group>
                ) : (
                    ""
                )
            ) : (
                <AnimeSectionLoaderPartial loaderTitle={"EPISODE LIST"} skeletonHeight={200} skeletonWidth={350} />
            )}
        </>
    );
}

export default AnimeDetailsEpisodeListComponent;
