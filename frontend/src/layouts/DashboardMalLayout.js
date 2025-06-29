import { Group, Paper, createStyles } from "@mantine/core";
import React, { useState } from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import DashboardMalImportPartial from "../partials/DashboardMalImportPartial";
import DashboardMalExportPartial from "../partials/DashboardMalExportPartial";

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

function DashboardMalLayout() {
    const { classes } = useStyles();
    const [activeTab, setActiveTab] = useState("import");
    return (
        <Group w={"100%"} h={"100%"} p={"md"} sx={{ flexDirection: "column" }}>
            <Group w={"100%"} sx={{ gap: "10px" }}>
                <Paper className={classes.pageButtons} onClick={() => setActiveTab("import")} sx={activeTab === "import" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                    Import
                </Paper>
                <Paper className={classes.pageButtons} onClick={() => setActiveTab("export")} sx={activeTab === "export" ? { backgroundColor: WATCHANIME_RED, color: "white" } : {}}>
                    Export
                </Paper>
            </Group>
            {activeTab === "import" ? <DashboardMalImportPartial /> : <DashboardMalExportPartial />}
        </Group>
    );
}

export default DashboardMalLayout;
