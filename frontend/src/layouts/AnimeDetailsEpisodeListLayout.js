import { Anchor, createStyles, Paper, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";
import { toTitleCase } from "../custom/AnimeData";

const useStyles = createStyles((theme) => ({
    card: {
        height: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundSize: "cover",
        backgroundPosition: "center",
        justifyContent: "flex-end",
        padding: "10px",
        width: 350,
        // [theme.fn.smallerThan("md")]: {
        //     width: "150px",
        // },
    },
    backGroundFilter: {
        width: "100%",
        height: "100%",
        transform: "translate(0%, -100%)",
        borderRadius: "7px",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.42) 51.04%, rgba(0, 0, 0, 0.94) 79.17%, #000000 100%)",
        opacity: "0.9",
        position: "absolute",
    },
    noTextDecoration: {
        textDecoration: "none",
        "&:hover": {
            textDecoration: "none",
        },
    },
    episodeCardEpisodeNumberDiv: {
        fontSize: "14px",
        backgroundColor: "transparent",
        padding: "2px 5px",
        borderRadius: "4px",
        position: "absolute",
        left: "10px",
        top: "10px",
        color: "white",
        border: "2px solid white",
    },
}));

function Card({ episodeData, index }) {
    const { classes } = useStyles();
    return (
        <>
            <Paper shadow="md" radius="md" sx={{ backgroundImage: `url(${episodeData.image.replace("kitsu.io", "kitsu.app")})` }} className={classes.card}>
                <Text lineClamp={1} sx={{ fontSize: "16px", fontWeight: "600", zIndex: 1 }}>
                    {toTitleCase(episodeData.title ?? `Episode ${index + 1}`, " ")}
                </Text>
            </Paper>
            <div className={classes.backGroundFilter}></div>
            <Paper className={classes.episodeCardEpisodeNumberDiv}>EP {index + 1}</Paper>
        </>
    );
}

function AnimeDetailsEpisodeListLayout({ episodeData, index, animeSlug }) {
    const { classes } = useStyles();

    return (
        <Anchor component={Link} to={`/anime/${animeSlug}/episode/${index + 1}`} className={classes.noTextDecoration} sx={{ position: "relative" }}>
            <Card episodeData={episodeData} index={index} />
        </Anchor>
    );
}

export default AnimeDetailsEpisodeListLayout;
