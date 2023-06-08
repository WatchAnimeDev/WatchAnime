import { Button, createStyles, Group, Image, Paper, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendarTime, IconPlayerPlay, IconStar } from "@tabler/icons";
import React from "react";
import { Link } from "react-router-dom";
import { SLIDER_HEIGHT } from "../constants/cssConstants";
import { getAnimeTitleByRelevance, getImageByRelevance, getTmdbImageByRelevanceAndType, hasTmdbData } from "../custom/AnimeData";

import topTenImage from "../assets/images/topten.svg";

const useStyles = createStyles((theme) => ({
    sliderButton: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",

        "&:hover": {
            backgroundColor: "rgba(255,255,255,0.2)",
            border: `1px solid rgba(255,255,255,0.4)`,
        },
    },
    sliderText: {
        display: "flex",
        position: "absolute",
        bottom: "6em",
        left: "2em",
        width: "50%",
        minHeight: "fit-content",
        padding: "1em",
        zIndex: "3",
        flexDirection: "column",
        height: "70%",
        justifyContent: "center",
        color: "rgba(255,255,255,0.9)",
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: "90%",
        },
    },
    sliderImageDiv: {
        backgroundSize: "cover",
        height: "100%",
        opacity: 0.5,
    },
    sliderFade: {
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "70%",
        zIndex: "1",
        background: "linear-gradient(0deg,#1A1B1E,transparent)",
        opacity: ".9",
    },
    logoImageDiv: {
        objectPosition: "left",
        color: "red",
        objectFit: "scale-down",
        marginBottom: "10px",
    },
}));

function HeaderSliderLayout({ anime, index }) {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

    return (
        <Paper sx={{ height: SLIDER_HEIGHT }} className="slider-slide">
            <Paper
                className={classes.sliderImageDiv}
                sx={{
                    backgroundImage: `url("${
                        mobile ? getImageByRelevance(anime.images, "large_image_url") : hasTmdbData(anime) ? getTmdbImageByRelevanceAndType(anime.tmdbData) : anime.bannerImage ? anime.bannerImage : getImageByRelevance(anime.images, "image_url")
                    }")`,
                }}
            ></Paper>
            <div className={classes.sliderText}>
                <Group display={"flex"} mb={"xs"} sx={{ gap: 10 }}>
                    <Image src={topTenImage} width={32} height={32}></Image>
                    <Text size={18}>{`#${index + 1} ${anime.type ? `in ${anime.type} shows today` : "Trending"}`}</Text>
                </Group>
                <Group sx={{ fontSize: 16 }} mb={"xs"}>
                    <Group spacing={2}>
                        <IconStar size={16} stroke={1.5} />
                        <Text>{anime.score}</Text>
                    </Group>
                    <Group spacing={2}>
                        <IconCalendarTime size={16} stroke={1.5} />
                        <Text>{anime.aired.string.toString().split("to")[0]}</Text>
                    </Group>
                </Group>
                {!hasTmdbData(anime) || mobile ? (
                    <Text lineClamp={1} size={56} lh={1.2} mb={"xs"}>
                        {getAnimeTitleByRelevance(anime.titles)}
                    </Text>
                ) : (
                    <img src={getTmdbImageByRelevanceAndType(anime.tmdbData, "logos")} width="500" height="150" className={classes.logoImageDiv} alt="" />
                )}

                <Text lineClamp={2} size={16}>{`Plot Summary: ${anime.synopsis}`}</Text>
                <Button fullWidth={false} size={"md"} sx={{ width: "fit-content", marginTop: "15px", padding: "10px 50px" }} radius={8} className={classes.sliderButton} component={Link} to={`/anime/${anime.slug}`}>
                    <IconPlayerPlay size={16} stroke={1.5} />
                    <Text sx={{ marginLeft: "5px" }}>Play</Text>
                </Button>
            </div>
            <Paper className={classes.sliderFade}></Paper>
        </Paper>
    );
}

export default HeaderSliderLayout;
