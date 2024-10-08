import { Anchor, createStyles, Group, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";

const useStyles = createStyles((theme) => ({
    parentEpisodeDiv: {
        marginTop: "15px",
        maxHeight: "140px",
        overflowY: "auto",
        opacity: "0.9",
        gap: "4px",
        gridTemplateColumns: "repeat(auto-fill,minmax(47px,1fr))",
        display: "grid",
        width: "100%",
    },
    eachEpisodeDiv: {
        backgroundColor: "#23272a",
        color: "white",
        padding: "5px",
        textAlign: "center",
        fontSize: "15px",
        display: "inline-block",
        fontWeight: "400",
        whiteSpace: "nowrap",
        "&:hover": {
            backgroundColor: "#1A1B1E",
            textDecoration: "none",
        },
    },
    watchedEpisodeDiv: {
        backgroundColor: "#363636",
        opacity: 0.6,
    },
}));

function VideoScreenEpisodeDisplayPartial({ episodeCount, episodeList, animeSlug, currentEpisode, watchHistoryData }) {
    episodeList = Object.keys(episodeList ?? {})
        .map((val) => parseFloat(val))
        .sort((x, y) => x - y);
    const { classes } = useStyles();
    const watchedEpisodes = watchHistoryData;
    return (
        <Group className={classes.parentEpisodeDiv}>
            {episodeList.length && episodeCount <= episodeList.length
                ? episodeList.map((val, ind) => {
                      return (
                          <Anchor
                              key={val}
                              component={Link}
                              to={`/anime/${animeSlug}/episode/${val}`}
                              className={classes.eachEpisodeDiv}
                              sx={val === parseFloat(currentEpisode) ? { pointerEvents: "none", backgroundColor: WATCHANIME_RED } : watchedEpisodes && watchedEpisodes[val] ? { backgroundColor: "#5e5e5e" } : {}}
                          >
                              <Text>{`${val}`}</Text>
                          </Anchor>
                      );
                  })
                : Array(episodeCount)
                      .fill(0)
                      .map((val, ind) => {
                          return (
                              <Anchor
                                  key={ind}
                                  component={Link}
                                  to={`/anime/${animeSlug}/episode/${ind + 1}`}
                                  className={classes.eachEpisodeDiv}
                                  sx={ind + 1 === parseInt(currentEpisode) ? { pointerEvents: "none", backgroundColor: WATCHANIME_RED } : watchedEpisodes && watchedEpisodes[ind + 1] ? { backgroundColor: "#5e5e5e" } : {}}
                              >
                                  <Text>{`${ind + 1}`}</Text>
                              </Anchor>
                          );
                      })}
        </Group>
    );
}

export default VideoScreenEpisodeDisplayPartial;
