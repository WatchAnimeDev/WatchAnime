import React from "react";
import { createStyles, Paper, Text, Group, Anchor, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { getAnimeTitleByRelevance, getImageByRelevance } from "../custom/AnimeData";

const useStyles = createStyles((theme) => ({
    card: {
        height: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundSize: "cover",
        backgroundPosition: "center",
        justifyContent: "flex-end",
        padding: "10px",
        maxWidth: "200px",
    },
    backGroundFilter: {
        width: "100%",
        height: "100%",
        transform: "translate(0%, -100%)",
        borderRadius: "7px",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.42) 51.04%, rgba(0, 0, 0, 0.94) 79.17%, #000000 100%)",
        opacity: "0.9",
    },
    animeSourceDiv: {
        backgroundColor: WATCHANIME_RED,
        borderRadius: "10px",
        fontSize: "10px",
        padding: "2px 10px",
    },
    noTextDecoration: {
        textDecoration: "none",
        "&:hover": {
            textDecoration: "none",
        },
    },
    sliderInfoDisplayDiv: {
        flexWrap: "nowrap",
        zIndex: "1",
        width: "100%",
        justifyContent: "space-between",
        gap: "15px",
    },
}));

function Card({ animeData }) {
    const { classes } = useStyles();

    return (
        <>
            <Paper shadow="md" radius="md" sx={{ backgroundImage: `url(${getImageByRelevance(animeData.images)})` }} className={classes.card}>
                <Group sx={{ width: "100%" }}>
                    <Group className={classes.sliderInfoDisplayDiv}>
                        <Tooltip label={getAnimeTitleByRelevance(animeData.titles)}>
                            <Text lineClamp={1} sx={{ fontSize: "15px", fontWeight: "600" }}>
                                {getAnimeTitleByRelevance(animeData.titles)}
                            </Text>
                        </Tooltip>
                        <Text sx={{ fontSize: "10px" }}>{`${animeData?.duration?.split(" ")[0]} min` ?? ""}</Text>
                    </Group>
                </Group>
                <Group sx={{ width: "100%" }}>
                    <Group className={classes.sliderInfoDisplayDiv}>
                        <Text lineClamp={1} sx={{ fontSize: "10px", flexBasis: "70%" }}>
                            {animeData.genres.map((genre) => genre.name).join(",")}
                        </Text>
                        <div className={classes.animeSourceDiv}>{animeData.type}</div>
                    </Group>
                </Group>
            </Paper>
            <div className={classes.backGroundFilter}></div>
        </>
    );
}

function AnimeSectionLayout({ anime }) {
    const { classes } = useStyles();
    return (
        <Anchor component={Link} to={`/anime/${anime.slug}${anime.currentReleasedEpisode ? `/episode/${anime.currentReleasedEpisode}` : ""}`} className={classes.noTextDecoration}>
            <Card animeData={anime} />
        </Anchor>
    );
}

export default AnimeSectionLayout;
