import { closeAllModals, openConfirmModal } from "@mantine/modals";
import { LastWatchedDataUpdateMutationObj, LastWatchedPageQueryObject, WatchHistoryDataUpdateMutationObj, WatchHistoryQueryObject } from "../graphql/graphqlQueries";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { getIdForLoggedInUser } from "./Auth";
import { Group, Paper, Text, Title } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

function syncWatchHistory(slug, episodeNumber, playBackData, userId = null) {
    return new Promise((resolve, reject) => {
        execGraphqlQuery(
            WatchHistoryDataUpdateMutationObj,
            {
                userId: userId || getIdForLoggedInUser(),
                slug: slug,
                episodeNumber: parseInt(episodeNumber),
                playBackData: playBackData,
            },
            0
        )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => reject(err));
    });
}

function syncWatchHistoryBulk() {
    const watchHistoryData = localStorage.getItem("watchHistory");
    if (watchHistoryData) {
        const watchHistoryJsonData = JSON.parse(watchHistoryData);
        for (const anime of Object.keys(watchHistoryJsonData)) {
            for (const episode of Object.keys(watchHistoryJsonData[anime].watchedEpisodes)) {
                syncWatchHistory(anime, episode, watchHistoryJsonData[anime]["watchedEpisodes"][episode]);
            }
        }
    }
    localStorage.setItem("watchHistory_bkp", watchHistoryData);
    localStorage.removeItem("watchHistory");
}

function syncLastWatched(slug, episodeNumber, userId = null) {
    return new Promise((resolve, reject) => {
        execGraphqlQuery(
            LastWatchedDataUpdateMutationObj,
            {
                userId: userId || getIdForLoggedInUser(),
                slug: slug,
                episodeNumber: parseInt(episodeNumber),
                shouldDelete: false,
            },
            0
        )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => reject(err));
    });
}

function getLastWatched(page = 1, pageSize = 20, userId = null) {
    return new Promise((resolve, reject) =>
        execGraphqlQuery(
            LastWatchedPageQueryObject,
            {
                userId: userId || getIdForLoggedInUser(),
                page: page,
                pageSize: pageSize,
            },
            0
        )
            .then((res) => {
                resolve(res.data.data.LastWatchedPage.media.map((y) => ({ ...y.media, playbackPercent: (y.playBackData.playBackTime / y.playBackData.duration) * 100 || 0, playBackData: y.playBackData })));
            })
            .catch((err) => reject(err))
    );
}

function removeLastWatched(slug, userId = null) {
    return new Promise((resolve, reject) =>
        execGraphqlQuery(
            LastWatchedDataUpdateMutationObj,
            {
                userId: userId || getIdForLoggedInUser(),
                slug: slug,
                episodeNumber: 0,
                shouldDelete: true,
            },
            0
        )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => reject(err))
    );
}

function getWatchHistory(slug, userId = null) {
    return new Promise((resolve, reject) =>
        execGraphqlQuery(
            WatchHistoryQueryObject,
            {
                userId: userId || getIdForLoggedInUser(),
                slug: slug,
            },
            0
        )
            .then((res) => {
                resolve(
                    res.data.data.WatchHistory?.reduce((acc, curr) => {
                        acc[curr.episodeNumber] = {
                            duration: curr.duration,
                            playBackTime: curr.playBackTime,
                        };
                        return acc;
                    }, {}) || {}
                );
            })
            .catch((err) => reject(err))
    );
}

const openCloudSyncModal = (setCloudSyncModalOpen, setCloudSyncModalText, cloudSyncPersentage, setCloudSyncPersentage) => {
    const lastWatchedData = localStorage.getItem("lastWatchedQueue");
    const watchHistoryData = localStorage.getItem("watchHistory");
    if (shouldDisplayCloudSyncBtn()) {
        openConfirmModal({
            title: "Cloud Sync",
            closeOnConfirm: true,
            closeOnCancel: false,
            closeOnClickOutside: false,
            labels: { confirm: "Start sync", cancel: "Dont Sync" },
            children: (
                <Group>
                    <Text size="md">Hi, we have detected that you have not synced your watch history. Please click on the button below to sync your watch history. </Text>
                </Group>
            ),
            cancelProps: { sx: { backgroundColor: "red !important" } },
            centered: true,
            onConfirm: async () => {
                setCloudSyncModalOpen(true);
                if (lastWatchedData) {
                    setCloudSyncModalText("Starting last watched sync...");
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const lastWatchedQueue = JSON.parse(lastWatchedData);
                    lastWatchedQueue.reverse();
                    for (const [ind, ele] of lastWatchedQueue.entries()) {
                        try {
                            await syncLastWatched(ele.slug, ele.episodeNumber);
                        } finally {
                            const newPercentage = cloudSyncPersentage + parseInt((ind / (lastWatchedQueue.length - 1)) * 100);
                            setCloudSyncModalText(`Successfully synced ${ele.slug} from last watched`);
                            setCloudSyncPersentage(newPercentage);
                        }
                    }
                    localStorage.setItem("lastWatchedQueue_bkp", lastWatchedData);
                    localStorage.removeItem("lastWatchedQueue");
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                if (watchHistoryData) {
                    setCloudSyncPersentage(0);
                    setCloudSyncModalText("Starting watched history sync...");
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const watchHistoryJsonData = JSON.parse(watchHistoryData);
                    for (const [ind, anime] of Object.keys(watchHistoryJsonData).entries()) {
                        const promiseArray = [];
                        for (const episode of Object.keys(watchHistoryJsonData[anime].watchedEpisodes)) {
                            promiseArray.push(syncWatchHistory(anime, episode, watchHistoryJsonData[anime]["watchedEpisodes"][episode]));
                        }
                        await Promise.allSettled(promiseArray);
                        const newPercentage = cloudSyncPersentage + parseInt((ind / (Object.keys(watchHistoryJsonData).length - 1)) * 100);
                        setCloudSyncModalText(`Successfully synced ${watchHistoryJsonData[anime]["animeData"].slug} from watch history`);
                        setCloudSyncPersentage(newPercentage);
                    }
                    localStorage.setItem("watchHistory_bkp", watchHistoryData);
                    localStorage.removeItem("watchHistory");
                }

                setCloudSyncModalText("Sync completed. This page will refresh in 2 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setCloudSyncModalOpen(false);
                window.location.reload();
            },
            onCancel: () => {
                openConfirmModal({
                    title: "Cloud Sync",
                    labels: { confirm: "Dont Sync", cancel: "Go Back" },
                    children: (
                        <Group sx={{ gap: "8px" }}>
                            <Group display={"flex"} sx={{ alignItems: "center", gap: "5px" }}>
                                <Paper display={"flex"} sx={{ transform: "translateY(2px)" }}>
                                    <IconAlertTriangle size={24} stroke={1.5} color="yellow" />
                                </Paper>
                                <Title order={3}>Warning</Title>
                            </Group>
                            <Text size="md">If you dont sync your watch history they wont show up in home page anymore. You will be able to sync them anytime from side bar menu.</Text>
                        </Group>
                    ),
                    confirmProps: { sx: { backgroundColor: "red !important" } },
                    centered: true,
                    onConfirm: () => {
                        localStorage.setItem("doNotSync", "1");
                        closeAllModals();
                    },
                });
            },
        });
    }
};

const shouldDisplayCloudSyncBtn = () => {
    const lastWatchedData = localStorage.getItem("lastWatchedQueue");
    const watchHistoryData = localStorage.getItem("watchHistory");
    if (lastWatchedData || watchHistoryData) {
        return true;
    } else {
        return false;
    }
};

export { syncWatchHistory, syncLastWatched, syncWatchHistoryBulk, getLastWatched, removeLastWatched, getWatchHistory, openCloudSyncModal, shouldDisplayCloudSyncBtn };
