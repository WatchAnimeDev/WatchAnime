import { Button, createStyles, Group, Paper, Space, Text, Title } from "@mantine/core";
import { IconPlayerPlay, IconPlus } from "@tabler/icons";
import React from "react";
import { Link } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { getAnimeTitleByRelevance, getImageByRelevance } from "../custom/AnimeData";

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
}));

function AnimeDetailsOverviewComponent({ animeData }) {
    const { classes } = useStyles();
    return (
        <Group>
            <Group px={"5%"} pt={"calc(5% + 56px)"} pb={"5%"} sx={{ minHeight: "600px", zIndex: "1", justifyContent: "space-evenly", width: "100%" }}>
                <Group>
                    <Paper sx={{ backgroundImage: `url(${getImageByRelevance(animeData.images)})`, height: "250px", width: "200px", backgroundSize: "cover", backgroundPosition: "center center" }}></Paper>
                </Group>
                <Group className={classes.animeInfoDiv}>
                    <Title sx={{ fontSize: "20px" }}>{getAnimeTitleByRelevance(animeData.titles)}</Title>
                    <Group>
                        <Button fullWidth={false} size={"md"} radius={5} component={Link} to={`/anime/${animeData.slug}`} className={classes.playButton}>
                            <IconPlayerPlay size={12} stroke={1.5} />
                            <Text sx={{ marginLeft: "5px" }}>Play</Text>
                        </Button>
                        <Button fullWidth={false} size={"md"} radius={5} component={Link} to={`/anime/${animeData.slug}`} className={classes.watchListButton}>
                            <IconPlus size={12} stroke={1.5} />
                            <Text sx={{ marginLeft: "5px" }}>Add to Watchlist</Text>
                        </Button>
                    </Group>
                    <Text sx={{ fontSize: "13px" }} lineClamp={3}>
                        {animeData.synopsis}
                    </Text>
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
                        <Text className={classes.frostedDivChildAnimeDetails}>Rating:</Text>
                        <Space w="5px" />
                        <Text className={classes.frostedDivChildAnimeDetailsValue}>{animeData.score ?? "NA"}</Text>
                    </Paper>
                </Group>
            </Group>
            <Group px={"5%"} pt={80} className={classes.backgroundImageDiv} sx={{ backgroundImage: `url(${getImageByRelevance(animeData.images)})` }}></Group>
        </Group>
    );
}

export default AnimeDetailsOverviewComponent;
