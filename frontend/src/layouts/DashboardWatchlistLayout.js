import { Group, Paper, Text, createStyles } from "@mantine/core";
import React, { useState } from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";

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
    return (
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
            </Group>
            <>Div</>
        </Group>
    );
}

export default DashboardWatchlistLayout;
