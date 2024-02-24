import { Anchor, Group, Text, createStyles } from "@mantine/core";
import { IconBrandDiscord, IconBrandFacebook } from "@tabler/icons";
import React from "react";

const useStyles = createStyles((theme) => ({
    discordIcon: {
        cursor: "pointer",
        "&:hover": {
            background: "#7289d9",
            padding: "1px",
            borderRadius: "5px",
        },
    },
    facebookIcon: {
        cursor: "pointer",
        "&:hover": {
            background: "#4267B2",
            padding: "1px",
            borderRadius: "5px",
        },
    },
}));

function JoinUsPartial() {
    const { classes } = useStyles();
    return (
        <Group sx={{ fontWeight: "400" }}>
            <Text>JOIN US</Text>
            <Anchor href="https://discord.gg/SvH8VJWKzN" target="_blank">
                <IconBrandDiscord size={16} stroke={1.5} color={"white"} className={classes.discordIcon} />
            </Anchor>
            <Anchor href="https://www.facebook.com/groups/198603402431856" target="_blank">
                <IconBrandFacebook size={16} stroke={1.5} color={"white"} className={classes.facebookIcon} />
            </Anchor>
        </Group>
    );
}

export default JoinUsPartial;
