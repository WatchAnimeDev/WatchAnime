import { Anchor, createStyles, Group, Paper, Text } from "@mantine/core";
import React from "react";
import { getAnimeTitleByRelevance, getImageByRelevance } from "../custom/AnimeData";
import { Link } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { STATIC_BUCKET_URL } from "../constants/genricConstants";

const useStyles = createStyles((theme) => ({
    subOrDubBackGroundImageDiv: {
        position: "absolute",
        zIndex: "1",
        left: "-10px",
        right: "-10px",
        bottom: "-10px",
        top: "-10px",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        filter: "blur(3px)",
        opacity: ".3",
        borderRadius: "10px",
    },
    subOrDubTextDiv: {
        fontWeight: "600",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "0 5px",
        zIndex: "3",
        display: "-webkit-box",
        WebkitLineClamp: "2",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textDecoration: "none",
        color: "white",
        "&:hover": {
            color: WATCHANIME_RED,
        },
    },
    subOrDubParentWrapper: {
        height: "80px",
        margin: "0 10px 10px",
        width: "250px",
        position: "relative",
        "&:before": {
            content: '""',
            position: "absolute",
            zIndex: "2",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: `url(${STATIC_BUCKET_URL}/live-thumb.png) repeat`,
        },
    },
}));

function AnimeDetailsSubDubComponent({ animeData }) {
    const { classes } = useStyles();
    const hasSub = animeData.slug.includes("-dub");
    const hasDub = animeData.hasDub;
    return hasSub || hasDub ? (
        <Group sx={{ width: "100%", marginBottom: "30px" }}>
            <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                <Text sx={{ fontSize: "20px", fontWeight: "700" }}>WATCH {hasSub ? "SUBBED" : "DUBBED"}</Text>
            </Group>
            <Group>
                <Anchor component={Link} to={`/anime/${hasSub ? animeData.slug.replace("-dub", "") : `${animeData.slug}-dub`}`} className={classes.subOrDubParentWrapper}>
                    <Text className={classes.subOrDubTextDiv}>{getAnimeTitleByRelevance(animeData.titles, !hasSub)}</Text>
                    <Paper className={classes.subOrDubBackGroundImageDiv} style={{ backgroundImage: `url(${getImageByRelevance(animeData.images)})` }}></Paper>
                </Anchor>
            </Group>
        </Group>
    ) : (
        <></>
    );
}

export default AnimeDetailsSubDubComponent;
