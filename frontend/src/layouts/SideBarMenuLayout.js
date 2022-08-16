import { Anchor, createStyles, Divider, Text } from "@mantine/core";
import { Link } from "react-router-dom";

import React from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";

const useStyles = createStyles((theme) => ({
    sideBarMenuLayoutAnchor: {
        width: "100%",
        padding: "15px 0px",
        textDecoration: "none",
        color: "white",
        "&:hover": {
            textDecoration: "none",
            color: WATCHANIME_RED,
        },
    },
}));

function SideBarMenuLayout({ menuData }) {
    const { classes } = useStyles();
    return (
        <>
            <Anchor
                component={Link}
                to="/"
                className={classes.sideBarMenuLayoutAnchor}
                onClick={(e) => {
                    e.preventDefault();
                    menuData.refs();
                }}
            >
                <Text>{menuData.label}</Text>
            </Anchor>

            <Divider my="sm" />
        </>
    );
}

export default SideBarMenuLayout;
