import { Button, Group, Switch, Text, TextInput, createStyles } from "@mantine/core";
import React from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";

const useStyles = createStyles((theme) => ({
    importSubmitButton: {
        backgroundColor: WATCHANIME_RED,
        width: "100px ",
        "&:hover": {
            backgroundColor: WATCHANIME_RED,
        },
    },
    importMainText: {
        fontSize: "14px",
    },
    importInputLabel: {
        fontWeight: "bolder",
        width: "35%",
    },
}));

function DashboardMalImportPartial() {
    const { classes } = useStyles();
    return (
        <>
            <Group w={"100%"} mt={"16px"} sx={{ alignItems: "flex-start", flexDirection: "column" }}>
                <Text className={classes.importMainText}>- Your MAL-List must be in Public status on your Privacy setting.</Text>
                <Text className={classes.importMainText}>- If an anime is available in your MAL-List but not available in the site, it will not be imported.</Text>
                <Text className={classes.importMainText}>- This process may take a few minutes to finish, depending on number of animes you have, so please be patient.</Text>
            </Group>
            <Group w={"100%"} mt={"16px"} sx={{ gap: "0px" }}>
                <Group w={"100%"} sx={{ gap: "5%" }}>
                    <Text className={classes.importInputLabel}>Your MAL username: </Text>
                    <TextInput w={"60%"} />
                </Group>
                <Group w={"100%"} sx={{ gap: "5%" }} mt={"16px"}>
                    <Text className={classes.importInputLabel}>Erase Existing Watchlist data? </Text>
                    <Group w={"60%"}>
                        <Switch color="red" />
                    </Group>
                </Group>
                <Group w={"100%"} sx={{ gap: "5%" }} mt={"5px"}>
                    <Text className={classes.importInputLabel}></Text>
                    <Group w={"60%"}>
                        <Text sx={{ fontSize: "10px" }}>Delete all anime in your Watch-List before importing your MAL. Otherwise your MAL-List will be merged with your current Watch-List.</Text>
                    </Group>
                </Group>
                <Group w={"100%"} mt={"64px"} sx={{ justifyContent: "flex-start", alignItems: "center" }} ml={"40%"}>
                    <Button className={classes.importSubmitButton}>Import</Button>
                </Group>
            </Group>
        </>
    );
}

export default DashboardMalImportPartial;
