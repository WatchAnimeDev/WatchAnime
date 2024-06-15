import { Button, Group, Radio, Switch, Text, createStyles } from "@mantine/core";
import React from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";

const useStyles = createStyles((theme) => ({
    exportSubmitButton: {
        backgroundColor: WATCHANIME_RED,
        width: "100px ",
        "&:hover": {
            backgroundColor: WATCHANIME_RED,
        },
    },
    exportMainText: {
        fontSize: "14px",
    },
    exportInputLabel: {
        fontWeight: "bolder",
        width: "35%",
    },
}));

function DashboardMalExportPartial() {
    const { classes } = useStyles();
    return (
        <>
            <Group w={"100%"} mt={"16px"}>
                <Text className={classes.exportMainText}>This will export your watch list to a list including links to popular meta sites like MyAnimeList, AniList, etc.</Text>
            </Group>
            <Group w={"100%"} mt={"16px"} sx={{ gap: "0px" }}>
                <Group w={"100%"} sx={{ gap: "5%" }}>
                    <Text className={classes.exportInputLabel}>Group by folder:</Text>
                    <Group w={"60%"}>
                        <Switch color="red" />
                    </Group>
                </Group>
                <Group w={"100%"} sx={{ gap: "5%" }} mt={"16px"}>
                    <Text className={classes.exportInputLabel}>Export format: </Text>
                    <Group w={"60%"}>
                        <Radio.Group withAsterisk value="JSON">
                            <Radio value="JSON" label="JSON" color="red" />
                            <Radio value="TEXT" label="TEXT" color="red" />
                        </Radio.Group>
                    </Group>
                </Group>

                <Group w={"100%"} mt={"64px"} sx={{ justifyContent: "flex-start", alignItems: "center" }} ml={"40%"}>
                    <Button className={classes.exportSubmitButton}>Export</Button>
                </Group>
            </Group>
        </>
    );
}

export default DashboardMalExportPartial;
