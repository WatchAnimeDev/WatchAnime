import { Anchor, createStyles, Paper, Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

import React from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { IconArrowsShuffle } from "@tabler/icons";
import { useLanguageStore } from "../store/LanguageToggleStore";
import { useShallow } from "zustand/react/shallow";
import axios from "axios";
import { API_BASE_URL } from "../constants/genricConstants";

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
    sideBarMenuIcons: {
        color: WATCHANIME_RED,
    },
    specialSectionWrapper: {
        width: "100%",
        height: "75px",
        backgroundColor: "rgb(37, 38, 43)",
        borderRadius: "0px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        margin: "5px 0px",
    },
    randomAnimeParentWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "transparent",
        color: "white",
        fontSize: "14px",
        cursor: "pointer",
    },
    languageToggleParentWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "transparent",
        color: "white",
        fontSize: "14px",
        cursor: "pointer",
    },
}));

const randomAnime = async (navigate, setSideBarState) => {
    const animeData = await Promise.all([axios.get(`${API_BASE_URL}/anime/random`)]);
    setSideBarState(false);
    navigate(`/anime/${animeData[0].data.slug}`);
};

function SideBarMenuLayout({ sideBarComponentConfig, setSideBarState }) {
    const { classes } = useStyles();
    const { language, languageToggle } = useLanguageStore(useShallow((state) => ({ language: state.language, languageToggle: state.toggle })));
    const navigate = useNavigate();
    return (
        <Paper w={"100%"}>
            <Paper className={classes.specialSectionWrapper}>
                <Paper onClick={() => randomAnime(navigate, setSideBarState)} className={classes.randomAnimeParentWrapper}>
                    <IconArrowsShuffle className={classes.sideBarMenuIcons} />
                    <Text mt={5}>Random</Text>
                </Paper>
                <Paper onClick={languageToggle} className={classes.languageToggleParentWrapper}>
                    <Paper sx={{ display: "flex", fontSize: "12px", borderRadius: "5px" }}>
                        <Paper py={3} px={5} c={"white"} sx={{ backgroundColor: language === "English" ? WATCHANIME_RED : "transperent", borderRadius: "0px" }}>
                            EN
                        </Paper>
                        <Paper py={3} px={5} c={"white"} sx={{ backgroundColor: language === "Default" ? WATCHANIME_RED : "transperent", borderRadius: "0px" }}>
                            JP
                        </Paper>
                    </Paper>
                    <Text mt={5}>Anime Name</Text>
                </Paper>
            </Paper>
            <Paper sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                {sideBarComponentConfig.data.map((menuData, ind) => {
                    return (
                        <Paper key={ind} py={"md"} pl={"16px"} sx={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                            <Anchor
                                component={Link}
                                to={`${menuData?.href ?? "/"}`}
                                className={classes.sideBarMenuLayoutAnchor}
                                onClick={(e) => {
                                    if (menuData.refs) {
                                        e.preventDefault();
                                        menuData.refs();
                                        setSideBarState(false);
                                    }
                                    if (menuData.href) {
                                        setSideBarState(false);
                                    }
                                    if (menuData.callBack) {
                                        e.preventDefault();
                                        menuData.callBack();
                                        setSideBarState(false);
                                    }
                                }}
                            >
                                <Text>{menuData.label}</Text>
                            </Anchor>
                        </Paper>
                    );
                })}
            </Paper>
        </Paper>
    );
}

export default SideBarMenuLayout;
