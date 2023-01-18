import React from "react";
import { createStyles, Paper, Text, Group, Anchor, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { getAnimeTitleByRelevance, getImageByRelevance, toTitleCase } from "../custom/AnimeData";
import { IconPlus, IconTrash } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { handleWatchListAdd, handleWatchListDelete } from "../custom/WatchList";
import { showGenericCheckBoxNotification } from "../custom/Notification";

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
        width: "200px",
        [theme.fn.smallerThan("md")]: {
            width: "150px",
        },
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
    animeSourceDiv: {
        backgroundColor: WATCHANIME_RED,
        borderRadius: "10px",
        fontSize: "10px",
        padding: "2px 10px",
        color: "white",
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
    playBackTimeDiv: {
        position: "absolute",
        height: "5px",
        background: WATCHANIME_RED,
        bottom: 0,
        zIndex: 1,
    },
    animeCardEpisodeDiv: {
        fontSize: "10px",
        background: WATCHANIME_RED,
        display: "inline-block",
        padding: "2px 12px",
        borderRadius: "4px",
        position: "absolute",
        left: "10px",
        top: "10px",
        color: "white",
    },
    animeCardHoverState: {
        transitionProperty: "opacity",
        transitionTimingFunction: "cubic-bezier(.4,0,.2,1)",
        transitionDuration: ".5s",
        backgroundColor: "rgba(0,0,0,.8)",
        opacity: 0,
        width: "100%",
        height: "100%",
        transform: "translate(0%, -100%)",
        position: "absolute",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        "&:hover": {
            opacity: "1",
        },
    },
    hoverContentBaseDiv: {
        height: "40px",
        width: "40px",
        border: "2px solid",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

function Card({ animeData, isDeletable, isAddableToWatchList, reRenderHomepage, setReRenderHomepage, featureId }) {
    const { classes } = useStyles();

    const handleDeleteFromAnimeCard = (e, featureId, selectedAnimeData) => {
        e.preventDefault();
        if (featureId === "lastWatched") {
            return handleDeleteFromLastWatched(selectedAnimeData);
        }
        if (featureId === "watchList") {
            return handleDeleteFromWatchList(selectedAnimeData);
        }
    };

    const handleDeleteFromWatchList = (selectedAnimeData) => {
        openConfirmModal({
            title: "Please confirm your action",
            children: <Text size="sm">Are you sure you want to delete {selectedAnimeData.title} from your watchlist?</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => {
                //dont do anything
            },
            onConfirm: async () => {
                await handleWatchListDelete(null, selectedAnimeData);
                setReRenderHomepage(!reRenderHomepage);
            },
            centered: true,
        });
    };

    const handleDeleteFromLastWatched = (selectedAnimeData) => {
        openConfirmModal({
            title: "Please confirm your action",
            children: <Text size="sm">Are you sure you want to delete {selectedAnimeData.title} from your watch history?</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => {
                //dont do anything
            },
            onConfirm: () => {
                let currWatched = JSON.parse(localStorage.getItem("lastWatchedQueue"));
                currWatched = currWatched.filter((anime) => anime.slug !== selectedAnimeData.slug);
                localStorage.setItem("lastWatchedQueue", JSON.stringify(currWatched));
                setReRenderHomepage(!reRenderHomepage);
                showGenericCheckBoxNotification("Deleted from watch history!", `${getAnimeTitleByRelevance(selectedAnimeData.titles)} has been deleted from your watch history!`);
            },
            centered: true,
        });
    };

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
                        <Text sx={{ fontSize: "10px" }}>{animeData.duration ? `${animeData?.duration?.split(" ")[0]} min` : ""}</Text>
                    </Group>
                </Group>
                <Group sx={{ width: "100%" }}>
                    <Group className={classes.sliderInfoDisplayDiv}>
                        <Text lineClamp={1} sx={{ fontSize: "10px", flexBasis: "70%" }}>
                            {toTitleCase(animeData.genres.map((genre) => genre.name).join(","), ",")}
                        </Text>
                        <div className={classes.animeSourceDiv}>{animeData.type ?? "TV"}</div>
                    </Group>
                </Group>

                <Paper className={classes.playBackTimeDiv} sx={{ width: `${animeData.playbackPercent * 0.9 ?? 0}%` }}></Paper>
                {animeData.currentReleasedEpisode ? <Paper className={classes.animeCardEpisodeDiv}>EP {animeData.currentReleasedEpisode}</Paper> : <></>}
            </Paper>
            <div className={classes.backGroundFilter}></div>
            {isDeletable || isAddableToWatchList ? (
                <Paper className={classes.animeCardHoverState} id={animeData.slug}>
                    {isDeletable ? (
                        <Tooltip label={featureId === "lastWatched" ? "Delete from Last Watched" : "Delete from WatchList"} withArrow position="bottom" transition="scale" transitionDuration={100}>
                            <span className={classes.hoverContentBaseDiv} onClick={(e) => handleDeleteFromAnimeCard(e, featureId, animeData)}>
                                <IconTrash size={20} />
                            </span>
                        </Tooltip>
                    ) : (
                        <></>
                    )}
                    {isAddableToWatchList ? (
                        <Tooltip label="Add to WatchList" withArrow position="bottom" transition="scale" transitionDuration={100}>
                            <span className={classes.hoverContentBaseDiv} onClick={async (e) => await handleWatchListAdd(e, animeData)}>
                                <IconPlus size={20} />
                            </span>
                        </Tooltip>
                    ) : (
                        <></>
                    )}
                </Paper>
            ) : (
                <></>
            )}
        </>
    );
}

function AnimeSectionLayout({ anime, isDeletable, isAddableToWatchList, reRenderHomepage, setReRenderHomepage, featureId }) {
    const { classes } = useStyles();

    return (
        <Anchor component={Link} to={`/anime/${anime.slug}${anime.currentReleasedEpisode ? `/episode/${anime.currentReleasedEpisode}` : ""}`} className={classes.noTextDecoration} sx={{ position: "relative" }}>
            <Card animeData={anime} isDeletable={isDeletable} reRenderHomepage={reRenderHomepage} setReRenderHomepage={setReRenderHomepage} featureId={featureId} isAddableToWatchList={isAddableToWatchList} />
        </Anchor>
    );
}

export default AnimeSectionLayout;
