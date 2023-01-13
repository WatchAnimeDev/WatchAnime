import { Anchor, Button, createStyles, Group, Paper, Space, Text, Title } from "@mantine/core";
import { IconPlayerPlay, IconPlus, IconX } from "@tabler/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { getAnimeTitleByRelevance, getImageByRelevance } from "../custom/AnimeData";
import { getWatchListDataBySlug, handleWatchListAdd, handleWatchListDelete } from "../custom/WatchList";
import AnimeDetailsNextEpisodePartial from "../partials/AnimeDetailsNextEpisodePartial";

import malImage from "../assets/images/mal.png";
import aniImage from "../assets/images/ani.png";

const useStyles = createStyles((theme) => ({
    backgroundImageDiv: {
        height: "600px",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        filter: "blur(20px)",
        opacity: ".35",
        position: "absolute",
        width: "100%",
    },
    playButton: {
        backgroundColor: WATCHANIME_RED,
        width: "fit-content",
        padding: "5px 10px",
        fontSize: "12px",
        height: "25px",
        "&:hover": {
            backgroundColor: WATCHANIME_RED,
            border: `1px solid ${WATCHANIME_RED}`,
        },
    },
    watchListButton: {
        backgroundColor: "transparent",
        width: "fit-content",
        padding: "5px 10px",
        fontSize: "12px",
        height: "25px",
        border: "1px solid white",
        "&:hover": {
            backgroundColor: "transparent",
            border: `1px solid ${WATCHANIME_RED}`,
        },
    },
    frostedDiv: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(145, 145, 145, 0.21)",
        borderRadius: "10px",
        maxWidth: "350px",
        minWidth: "300px",
        [theme.fn.smallerThan("lg")]: {
            maxWidth: "100%",
        },
    },
    frostedDivChild: {
        width: "100%",
        backgroundColor: "transparent",
        display: "flex",
        padding: "5px",
    },
    frostedDivChildAnimeDetails: {
        color: "white",
        fontSize: "12px",
    },
    frostedDivChildAnimeDetailsValue: {
        fontSize: "12px",
    },
    animeInfoDiv: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: "45%",
        margin: "15px",
        [theme.fn.smallerThan("lg")]: {
            maxWidth: "100%",
        },
    },
    titleParentDiv: {
        display: "flex",
        flexDirection: "column",
        gap: 0,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    ratingText: {
        color: "rgb(70, 211, 105)",
        fontWeight: "bolder",
    },
    aniDiv: {
        height: 24,
        width: 24,
        backgroundImage: `url(${aniImage})`,
        backgroundSize: "cover",
    },
    malDiv: {
        height: 24,
        width: 24,
        backgroundImage: `url(${malImage})`,
        backgroundSize: "cover",
    },
}));

function AnimeDetailsOverviewComponent({ animeData, episodeInfoData }) {
    const { classes } = useStyles();
    const [watchListData, setWatchListData] = useState(getWatchListDataBySlug(animeData.slug));
    return (
        <Group>
            <Group px={"5%"} pt={"calc(5% + 56px)"} pb={"5%"} sx={{ minHeight: "600px", zIndex: "1", justifyContent: "space-evenly", width: "100%" }}>
                <Group>
                    <Paper sx={{ backgroundImage: `url(${getImageByRelevance(animeData.images)})`, height: "250px", width: "200px", backgroundSize: "cover", backgroundPosition: "center center" }}></Paper>
                </Group>
                <Group className={classes.animeInfoDiv}>
                    <Group className={classes.titleParentDiv}>
                        {animeData.score ? <Text className={classes.ratingText}>{`${parseInt(parseFloat(animeData.score) * 10)}% rating`}</Text> : ""}
                        <Title sx={{ fontSize: "30px" }}>{getAnimeTitleByRelevance(animeData.titles)}</Title>
                    </Group>
                    <Group>
                        <Button fullWidth={false} size={"md"} radius={5} component={Link} to={`/anime/${animeData.slug}/episode/1`} className={classes.playButton}>
                            <IconPlayerPlay size={12} stroke={1.5} />
                            <Text sx={{ marginLeft: "5px" }}>Play</Text>
                        </Button>
                        {!Object.keys(watchListData).length ? (
                            <Button fullWidth={false} size={"md"} radius={5} onClick={async (e) => await handleWatchListAdd(e, animeData, setWatchListData)} className={classes.watchListButton}>
                                <IconPlus size={12} stroke={1.5} />
                                <Text sx={{ marginLeft: "5px" }}>Add to Watchlist</Text>
                            </Button>
                        ) : (
                            <Button
                                fullWidth={false}
                                size={"md"}
                                radius={5}
                                onClick={async (e) => {
                                    await handleWatchListDelete(e, animeData, setWatchListData);
                                }}
                                className={classes.watchListButton}
                            >
                                <IconX size={12} stroke={1.5} color="white" />
                                <Text sx={{ marginLeft: "5px" }}>Delete From Watchlist</Text>
                            </Button>
                        )}
                    </Group>
                    <Text sx={{ fontSize: "13px" }} lineClamp={3}>
                        {animeData.synopsis}
                    </Text>
                    <AnimeDetailsNextEpisodePartial episodeInfoData={episodeInfoData} />
                </Group>
                <Group p={10} className={classes.frostedDiv}>
                    <Paper className={classes.frostedDivChild}>
                        <Text className={classes.frostedDivChildAnimeDetails}>Other Names:</Text>
                        <Space w="5px" />
                        <Text className={classes.frostedDivChildAnimeDetailsValue} lineClamp={1}>
                            {animeData.titles
                                .filter((title) => title.type !== "Default")
                                .map((title) => title.title)
                                .join(", ")}
                        </Text>
                    </Paper>
                    <Paper className={classes.frostedDivChild}>
                        <Text className={classes.frostedDivChildAnimeDetails}>Premired:</Text>
                        <Space w="5px" />
                        <Text className={classes.frostedDivChildAnimeDetailsValue}>{animeData.aired.string ?? "NA"}</Text>
                    </Paper>
                    <Paper className={classes.frostedDivChild}>
                        <Text className={classes.frostedDivChildAnimeDetails}>Duration:</Text>
                        <Space w="5px" />
                        <Text className={classes.frostedDivChildAnimeDetailsValue}>{animeData.duration ?? "NA"}</Text>
                    </Paper>
                    <Paper className={classes.frostedDivChild}>
                        <Text className={classes.frostedDivChildAnimeDetails}>Status:</Text>
                        <Space w="5px" />
                        <Text className={classes.frostedDivChildAnimeDetailsValue}>{animeData.airing ? "Airing" : "Finished"}</Text>
                    </Paper>
                    <Paper className={classes.frostedDivChild}>
                        <Text className={classes.frostedDivChildAnimeDetails}>Genres:</Text>
                        <Space w="5px" />
                        <Text className={classes.frostedDivChildAnimeDetailsValue}>{animeData.genres?.length ? animeData.genres.map((genre) => genre.name).join(", ") : "NA"}</Text>
                    </Paper>
                    <Paper className={classes.frostedDivChild}>
                        <Text className={classes.frostedDivChildAnimeDetails}>Studios:</Text>
                        <Space w="5px" />
                        <Text className={classes.frostedDivChildAnimeDetailsValue}>{animeData.studios?.length ? animeData.studios.map((studio) => studio.name).join(", ") : "NA"}</Text>
                    </Paper>
                    <Paper className={classes.frostedDivChild}>
                        <Text className={classes.frostedDivChildAnimeDetails}>Episodes(Released):</Text>
                        <Space w="5px" />
                        <Text className={classes.frostedDivChildAnimeDetailsValue}>{animeData.episodes ?? "NA"}</Text>
                    </Paper>
                    <Paper className={classes.frostedDivChild}>
                        <Text className={classes.frostedDivChildAnimeDetails}>External Links:</Text>
                        <Space w="5px" />
                        {animeData.malId || animeData.aniId ? (
                            <Group sx={{ gap: 5 }}>
                                {animeData.malId ? <Anchor className={classes.malDiv} href={`https://myanimelist.net/anime/${animeData.malId}`} target="_blank"></Anchor> : ""}
                                {animeData.aniId ? <Anchor className={classes.aniDiv} href={`https://anilist.co/anime/${animeData.aniId}`} target="_blank"></Anchor> : ""}
                            </Group>
                        ) : (
                            ""
                        )}
                    </Paper>
                </Group>
            </Group>
            <Group px={"5%"} pt={80} className={classes.backgroundImageDiv} sx={{ backgroundImage: `url(${getImageByRelevance(animeData.images)})` }}></Group>
        </Group>
    );
}

export default AnimeDetailsOverviewComponent;
