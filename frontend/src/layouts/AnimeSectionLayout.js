import React from "react";
import { createStyles, Paper, Text, Group, Anchor, Tooltip, Transition } from "@mantine/core";
import { Link } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { getAnimeTitleByRelevance, getImageByRelevance, toTitleCase } from "../custom/AnimeData";
import { IconPlus, IconTrash } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showGenericCheckBoxNotification } from "../custom/Notification";
import { useLanguageStore } from "../store/LanguageToggleStore";
import { useShallow } from "zustand/react/shallow";
import { useWatchListStore } from "../store/WatchListStore";
import { getLastWatched, removeLastWatched } from "../custom/CloudSync";
import { useDisclosure } from "@mantine/hooks";

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
    animeCardNewEpisodeDiv: {
        fontSize: "10px",
        background: WATCHANIME_RED,
        display: "inline-block",
        padding: "2px 12px",
        borderRadius: "4px",
        position: "absolute",
        right: "10px",
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

function Card({ animeData, isDeletable, isAddableToWatchList, featureId, setLastWatchedData, ActionComponent, actionComponentData }) {
    const { classes } = useStyles();
    const { language } = useLanguageStore(useShallow((state) => ({ language: state.language })));
    const { handleWatchListAdd, handleWatchListDelete } = useWatchListStore(useShallow((state) => ({ handleWatchListAdd: state.handleWatchListAdd, handleWatchListDelete: state.handleWatchListDelete })));
    const [isCardOpen, isCardOpenHandler] = useDisclosure(false);

    setTimeout(() => {
        isCardOpenHandler.open();
    }, 10);

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
            children: <Text size="sm">Are you sure you want to delete {getAnimeTitleByRelevance(selectedAnimeData.titles, false, language)} from your watchlist?</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => {
                //dont do anything
            },
            onConfirm: async () => {
                await handleWatchListDelete(selectedAnimeData);
            },
            centered: true,
        });
    };

    const handleDeleteFromLastWatched = (selectedAnimeData) => {
        openConfirmModal({
            title: "Please confirm your action",
            children: <Text size="sm">Are you sure you want to delete {getAnimeTitleByRelevance(selectedAnimeData.titles, false, language)} from your watch history?</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => {
                //dont do anything
            },
            onConfirm: async () => {
                await removeLastWatched(selectedAnimeData.slug);
                const newLastWatchedData = await getLastWatched();
                setLastWatchedData(newLastWatchedData);
                showGenericCheckBoxNotification("Deleted from watch history!", `${getAnimeTitleByRelevance(selectedAnimeData.titles, false, language)} has been deleted from your watch history!`);
            },
            centered: true,
        });
    };

    const hasNewEpisodeReleasedForWatchlistAnime = (animeData, featureId) => {
        if (featureId !== "watchList") {
            return false;
        }
        return animeData.hasNewEpisode;
    };

    return (
        <Transition mounted={isCardOpen} transition="slide-up" duration={300} timingFunction="linear">
            {(styles) => (
                <div style={{ ...styles }}>
                    <Paper shadow="md" radius="md" sx={{ backgroundImage: `url(${getImageByRelevance(animeData.images)})` }} className={classes.card}>
                        <Group sx={{ width: "100%" }}>
                            <Group className={classes.sliderInfoDisplayDiv}>
                                <Tooltip label={getAnimeTitleByRelevance(animeData.titles, false, language)}>
                                    <Text lineClamp={1} sx={{ fontSize: "15px", fontWeight: "600" }}>
                                        {getAnimeTitleByRelevance(animeData.titles, false, language)}
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
                        {ActionComponent && <ActionComponent animeData={animeData} actionComponentData={actionComponentData} />}
                        {hasNewEpisodeReleasedForWatchlistAnime(animeData, featureId) ? <Paper className={classes.animeCardNewEpisodeDiv}>NEW</Paper> : <></>}
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
                                    <span
                                        className={classes.hoverContentBaseDiv}
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            await handleWatchListAdd(animeData);
                                        }}
                                    >
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
                </div>
            )}
        </Transition>
    );
}

function AnimeSectionLayout({ anime, isDeletable, isAddableToWatchList, featureId, setLastWatchedData, actionComponent, actionComponentData }) {
    const { classes } = useStyles();
    return (
        <Anchor component={Link} to={`/anime/${anime.slug}${anime.currentReleasedEpisode ? `/episode/${anime.currentReleasedEpisode ? anime.currentReleasedEpisode : 0}` : ""}`} className={classes.noTextDecoration} sx={{ position: "relative" }}>
            <Card animeData={anime} isDeletable={isDeletable} featureId={featureId} isAddableToWatchList={isAddableToWatchList} setLastWatchedData={setLastWatchedData} ActionComponent={actionComponent} actionComponentData={actionComponentData} />
        </Anchor>
    );
}

export default AnimeSectionLayout;
