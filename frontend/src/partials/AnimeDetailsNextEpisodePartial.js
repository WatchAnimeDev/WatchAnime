import { createStyles, Group, Text } from "@mantine/core";
import React from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { getDayHourMinuteSecondFromSecond } from "../custom/DateTime";

const useStyles = createStyles((theme) => ({
    nextEpisodeInfoDiv: {
        display: "flex",
        flexDirection: "column",
        gap: 0,
        alignItems: "flex-start",
        borderLeft: `3px solid ${WATCHANIME_RED}`,
        paddingLeft: 10,
    },
    nextEpisodeInfoDivNextEpisodeText: {
        fontSize: 14,
    },
    nextEpisodeInfoDivTimeDisplayDiv: {
        fontSize: 17,
        fontWeight: 700,
    },
}));

function AnimeDetailsNextEpisodePartial({ episodeInfoData }) {
    const { classes } = useStyles();

    const formatTime = (timeInSec) => {
        if (timeInSec <= 0) {
            return "Airing Now";
        }
        const timeObj = getDayHourMinuteSecondFromSecond(timeInSec);
        return `${timeObj.days}d ${timeObj.hours}hrs ${timeObj.mins}mins`;
    };

    return episodeInfoData.nextAiringEpisode ? (
        <Group className={classes.nextEpisodeInfoDiv}>
            <Text className={classes.nextEpisodeInfoDivNextEpisodeText}>Next Episode in:</Text>
            <Text className={classes.nextEpisodeInfoDivTimeDisplayDiv}>{formatTime(episodeInfoData.nextAiringEpisode.timeUntilAiring)}</Text>
        </Group>
    ) : (
        <></>
    );
}

export default AnimeDetailsNextEpisodePartial;
