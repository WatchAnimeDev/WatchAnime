import { Group, Menu, Paper, createStyles } from "@mantine/core";
import { IconCheck, IconDotsVertical } from "@tabler/icons";
import React from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { unSubscribeToEpisodeNotification } from "../custom/Notifications";
import { useWatchListStore } from "../store/WatchListStore";
import { useShallow } from "zustand/react/shallow";
import { dismissGenericDynamicNotification, showGenericDynamicNotification } from "../custom/Notification";
import { getAnimeTitleByRelevance } from "../custom/AnimeData";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { WatchListEditTypeMutationObj } from "../graphql/graphqlQueries";
import { getUidForLoggedInUser } from "../custom/Auth";

const useStyles = createStyles((theme) => ({
    animeCardActionDiv: {
        borderRadius: "4px",
        position: "absolute",
        right: "10px",
        top: "10px",
        height: "26px",
        width: "26px",
        color: "white",
        backgroundColor: WATCHANIME_RED,
        zIndex: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: "0.8",
        "&:hover": {
            opacity: "1",
        },
    },
}));

const watchListTypeMap = {
    1: "Currently Watching",
    2: "Completed",
    3: "On Hold",
    4: "Dropped",
    5: "Plan to Watch",
};

function DashboardAnimeCardActionPartial({ animeData, actionComponentData }) {
    const { classes } = useStyles();
    const { fetchWatchListDataPaginated, fetchWatchListData } = useWatchListStore(useShallow((state) => ({ fetchWatchListDataPaginated: state.fetchWatchListDataPaginated, fetchWatchListData: state.fetchWatchListData })));

    const handleWatchlistTypeChange = async (type) => {
        showGenericDynamicNotification(
            `dynamic-notif-watchlist-change-${animeData.slug}`,
            "Changing watchlist type!",
            `${getAnimeTitleByRelevance(animeData.titles)} is being moved from ${watchListTypeMap[animeData.watchlistType]} to ${watchListTypeMap[type]}`
        );
        await execGraphqlQuery(
            WatchListEditTypeMutationObj,
            {
                userId: getUidForLoggedInUser(),
                watchlistType: type,
                slugId: animeData.slug,
            },
            0
        );
        await fetchWatchListDataPaginated(...actionComponentData.fetchKey);
        //if the anime is in currently watching list need to refresh home page data
        if (animeData.watchlistType === 1) {
            await fetchWatchListData();
        }
        dismissGenericDynamicNotification(
            `dynamic-notif-watchlist-change-${animeData.slug}`,
            "Changed watchlist type!",
            `${getAnimeTitleByRelevance(animeData.titles)} has been moved from ${watchListTypeMap[animeData.watchlistType]} to ${watchListTypeMap[type]}`
        );
    };

    return (
        <Menu position="bottom-end" withArrow>
            <Menu.Target>
                <Paper className={classes.animeCardActionDiv} onClick={(e) => e.preventDefault()}>
                    <IconDotsVertical size={16} />
                </Paper>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        handleWatchlistTypeChange(1);
                    }}
                >
                    <Group sx={{ gap: "5px" }}>
                        Currently Watching
                        {animeData.watchlistType === 1 && <IconCheck size={16} />}
                    </Group>
                </Menu.Item>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        handleWatchlistTypeChange(2);
                    }}
                >
                    <Group sx={{ gap: "5px" }}>
                        Completed
                        {animeData.watchlistType === 2 && <IconCheck size={16} />}
                    </Group>
                </Menu.Item>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        handleWatchlistTypeChange(3);
                    }}
                >
                    <Group sx={{ gap: "5px" }}>
                        On Hold
                        {animeData.watchlistType === 3 && <IconCheck size={16} />}
                    </Group>
                </Menu.Item>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        handleWatchlistTypeChange(4);
                    }}
                >
                    <Group sx={{ gap: "5px" }}>
                        Dropped
                        {animeData.watchlistType === 4 && <IconCheck size={16} />}
                    </Group>
                </Menu.Item>
                <Menu.Item
                    onClick={(e) => {
                        e.preventDefault();
                        handleWatchlistTypeChange(5);
                    }}
                >
                    <Group sx={{ gap: "5px" }}>
                        Plan To Watch
                        {animeData.watchlistType === 5 && <IconCheck size={16} />}
                    </Group>
                </Menu.Item>
                <Menu.Item
                    onClick={async (e) => {
                        e.preventDefault();
                        showGenericDynamicNotification(`dynamic-notif-watchlist-delete-${animeData.slug}`, "Removing from watchlist!", `${getAnimeTitleByRelevance(animeData.titles)} is being removed from watchlist!`);
                        await unSubscribeToEpisodeNotification(animeData.slug);
                        await fetchWatchListDataPaginated(...actionComponentData.fetchKey);
                        dismissGenericDynamicNotification(`dynamic-notif-watchlist-delete-${animeData.slug}`, "Removed from watchlist!", `${getAnimeTitleByRelevance(animeData.titles)} has been removed from watchlist!`);
                    }}
                    sx={{ color: WATCHANIME_RED }}
                >
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}

export default DashboardAnimeCardActionPartial;
