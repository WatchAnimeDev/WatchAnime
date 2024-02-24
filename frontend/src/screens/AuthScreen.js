import React from "react";
import JoinUsPartial from "../partials/JoinUsPartial";

import { Paper, createStyles, useMantineTheme } from "@mantine/core";

import signBackgroundImage from "../assets/images/sign-background.jpg";
import HeaderLogoPartial from "../partials/HeaderLogoPartial";
import { useMediaQuery } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
    wrapper: {
        height: "100vh",
        backgroundSize: "cover",
        backgroundImage: `url(${signBackgroundImage})`,
    },
    form: {
        height: "100%",
        opacity: 0.8,
        backgroundColor: "black",
        width: "50vw",
        maxWidth: "450px",

        [theme.fn.smallerThan("sm")]: {
            width: "100vw",
            maxWidth: "100%",
        },
        display: "flex",
        flexDirection: "column",
    },
}));

function AuthScreen({ isChristmasEnabled, renderComponent }) {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form} radius={0} p={30}>
                <Paper sx={{ backgroundColor: "transparent", display: "flex", justifyContent: "center" }} py={50}>
                    <HeaderLogoPartial isChristmasEnabled={isChristmasEnabled} mobile={mobile} />
                </Paper>
                {renderComponent}
                <Paper sx={{ backgroundColor: "transparent", display: "flex", justifyContent: "center" }} py={50}>
                    <JoinUsPartial />
                </Paper>
            </Paper>
        </div>
    );
}

export default AuthScreen;
