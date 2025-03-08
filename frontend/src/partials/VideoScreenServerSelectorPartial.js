import { createStyles, Group, Paper, Text, Title } from "@mantine/core";
import React from "react";
import ReactCountryFlag from "react-country-flag";

import { getImageByRelevance } from "../custom/AnimeData";

const useStyles = createStyles((theme) => ({
    backgroundImageDiv: {
        backgroundSize: "cover",
        backgroundPosition: "center center",
        filter: "blur(20px)",
        opacity: ".35",
        width: "100%",
        position: "absolute",
    },
    flagAndTextDiv: {
        gap: "0.275rem",
        backgroundColor: "#0f172a80",
        fontSize: "0.75rem",
        borderRadius: "0.375rem",
    },
}));

function VideoScreenServerSelectorPartial({ server, episodeData }) {
    const { classes } = useStyles();
    return (
        <Group sx={{ backgroundColor: "#4b556380", color: "white", filter: "drop-shadow(0 10px 8px rgb(0 0 0 / .04)) drop-shadow(0 4px 3px rgb(0 0 0 / .1))" }} w={"100%"} py={"sm"} px={"md"}>
            <Group w={"100%"} sx={{ justifyContent: "center" }}>
                <Title order={4}>{server.name.split("|").pop()}</Title>
            </Group>
            <Group>
                <Group w={"100%"} sx={{ fontSize: "0.875rem" }}>
                    <Group sx={{ gap: "0.275rem" }}>
                        Duration:
                        <Text sx={{ backgroundColor: "#0f172a80", fontSize: "0.75rem", borderRadius: "0.375rem" }} px={"0.5rem"} py={"0.25rem"}>
                            24:00
                        </Text>
                    </Group>
                    <Group sx={{ gap: "0.275rem" }}>
                        Source:
                        <Text sx={{ backgroundColor: "#0f172a80", fontSize: "0.75rem", borderRadius: "0.375rem" }} px={"0.5rem"} py={"0.25rem"}>
                            WEB
                        </Text>
                    </Group>
                </Group>
                <Group w={"100%"} sx={{ fontSize: "0.875rem", gap: "0.275rem" }}>
                    Audio:
                    <Group>
                        <Group className={classes.flagAndTextDiv} px={"0.5rem"} py={"0.25rem"}>
                            <ReactCountryFlag
                                countryCode="GB"
                                svg
                                style={{
                                    width: "16px",
                                }}
                            />
                            English
                        </Group>
                    </Group>
                </Group>
                <Group w={"100%"} sx={{ fontSize: "0.875rem", gap: "0.275rem" }}>
                    {server.info.isSoftSub && server.info.isHardSub ? "Soft/Hard Sub" : server.info.isSoftSub ? "Soft Sub" : "Hard Sub"}:
                    <Group>
                        <Group className={classes.flagAndTextDiv} px={"0.5rem"} py={"0.25rem"}>
                            <ReactCountryFlag
                                countryCode="GB"
                                svg
                                style={{
                                    width: "16px",
                                }}
                            />
                            English
                        </Group>
                    </Group>
                </Group>
            </Group>

            {/* <Group px={"5%"} pt={80} className={classes.backgroundImageDiv} sx={{ backgroundImage: `url(${getImageByRelevance(episodeData.animeDetails.images)})` }}></Group> */}
        </Group>
    );
}

export default VideoScreenServerSelectorPartial;
