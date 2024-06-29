import { Group, Loader, Pagination, Paper, createStyles } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import AnimeSectionLayout from "./AnimeSectionLayout";
import { useMemo } from "react";
import InformationPikachuPartial from "../partials/InformationPikachuPartial";
import DashboardAnimeCardActionPartial from "../partials/DashboardAnimeCardActionPartial";
import { useWatchListStore } from "../store/WatchListStore";
import { useShallow } from "zustand/react/shallow";

const useStyles = createStyles((theme) => ({
    pageButtons: {
        cursor: "pointer",
        backgroundColor: "rgb(35, 39, 42)",
        color: "white",
        padding: "8px 10px",
        fontSize: "14px",
        "&:hover": {
            borderColor: "1px solid red",
        },
    },
}));

function DashboardWatchlistLayout() {
    const { classes } = useStyles();
    const [activeTab, setActiveTab] = useState("all");
    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [pageLoad, setPageLoad] = useState(false);
    const [page, setPage] = useState(1);
    const { fetchWatchListDataPaginated, watchListDataPaginated } = useWatchListStore(useShallow((state) => ({ fetchWatchListDataPaginated: state.fetchWatchListDataPaginated, watchListDataPaginated: state.watchListDataPaginated })));

    const pageWatchlistTypeMap = useMemo(() => {
        return {
            all: 0,
            current: 1,
            completed: 2,
            hold: 3,
            dropped: 4,
            plan: 5,
        };
    }, []);

    useEffect(() => {
        async function fetchWatchListDatas() {
            await fetchWatchListDataPaginated(page, 20, pageWatchlistTypeMap[activeTab]);
            setAjaxComplete(true);
            setPageLoad(true);
        }
        setPageLoad(false);
        fetchWatchListDatas();
    }, [activeTab, page, pageWatchlistTypeMap, fetchWatchListDataPaginated]);

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    return (
        <Group w={"100%"} h={"100%"} sx={{ justifyContent: "center", alignItems: "center" }}>
            {ajaxComplete ? (
                <Group w={"100%"} h={"100%"} p={"md"} sx={{ flexDirection: "column" }}>
                    <Group w={"100%"} sx={{ gap: "10px" }}>
                        <Paper className={classes.pageButtons} onClick={() => setActiveTab("all")} sx={activeTab === "all" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                            All Anime
                        </Paper>
                        <Paper className={classes.pageButtons} onClick={() => setActiveTab("current")} sx={activeTab === "current" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                            Currently Watching
                        </Paper>
                        <Paper className={classes.pageButtons} onClick={() => setActiveTab("completed")} sx={activeTab === "completed" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                            Completed
                        </Paper>
                        <Paper className={classes.pageButtons} onClick={() => setActiveTab("hold")} sx={activeTab === "hold" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                            On Hold
                        </Paper>
                        <Paper className={classes.pageButtons} onClick={() => setActiveTab("dropped")} sx={activeTab === "dropped" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                            Dropped
                        </Paper>
                        <Paper className={classes.pageButtons} onClick={() => setActiveTab("plan")} sx={activeTab === "plan" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                            Plan To Watch
                        </Paper>
                    </Group>
                    <Group w={"100%"} sx={!pageLoad ? { justifyContent: "center", alignItems: "center", flexGrow: 1 } : { justifyContent: "center", alignItems: "flex-start", flexGrow: 1 }}>
                        {pageLoad ? (
                            watchListDataPaginated.fetchedWatchListData.length ? (
                                <Group w={"100%"} h={"100%"} sx={!pageLoad ? { justifyContent: "center", alignItems: "center" } : { justifyContent: "center", alignItems: "flex-start" }}>
                                    <Group w={"100%"}>
                                        {watchListDataPaginated.fetchedWatchListData.map((genericData, ind) => (
                                            <AnimeSectionLayout anime={genericData} key={ind} actionComponent={DashboardAnimeCardActionPartial} actionComponentData={{ fetchKey: [page, 20, pageWatchlistTypeMap[activeTab]] }} />
                                        ))}
                                    </Group>
                                    <Group mt={"auto"}>
                                        <Pagination
                                            page={page}
                                            onChange={setPage}
                                            total={watchListDataPaginated.fetchedWatchListDataPageInfo.lastPage}
                                            styles={(theme) => ({
                                                item: {
                                                    "&[data-active]": {
                                                        backgroundColor: WATCHANIME_RED,
                                                    },
                                                },
                                            })}
                                        />
                                    </Group>
                                </Group>
                            ) : (
                                <InformationPikachuPartial message={`Sorry, but your watchlist is empty`} subMessage={"(┬┬﹏┬┬)"} />
                            )
                        ) : (
                            <Loader />
                        )}
                    </Group>
                </Group>
            ) : (
                <Loader />
            )}
        </Group>
    );
}

export default DashboardWatchlistLayout;
