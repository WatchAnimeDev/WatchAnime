import { Button, createStyles, Group, Paper, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendarTime, IconPlayerPlay, IconStar } from "@tabler/icons";
import React from "react";
import { Link } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { SLIDER_HEIGHT } from "../constants/cssConstants";
import { getImageByRelevance } from "../custom/AnimeData";

const useStyles = createStyles((theme) => ({
    sliderButton: {
        backgroundColor: WATCHANIME_RED,
        "&:hover": {
            backgroundColor: WATCHANIME_RED,
            border: `1px solid ${WATCHANIME_RED}`,
        },
    },
    sliderText: {
        display: "flex",
        position: "absolute",
        bottom: "6em",
        left: "2em",
        width: "50%",
        height: "fit-content",
        padding: "1em",
        zIndex: "3",
        flexDirection: "column",
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: "90%",
        },
    },
}));

function HeaderSliderLayout({ anime, index }) {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
    return (
        <Paper sx={{ height: SLIDER_HEIGHT, backgroundImage: `url("${mobile ? getImageByRelevance(anime.images, "image_url") : anime.bannerImage ?? getImageByRelevance(anime.images, "image_url")}")`, backgroundSize: "cover" }} className="slider-slide">
            <div className={classes.sliderText}>
                <Text sx={{ color: WATCHANIME_RED }}>{`#${index + 1} Trending`}</Text>
                <Group>
                    <Group spacing={2}>
                        <IconPlayerPlay size={16} stroke={1.5} />
                        <Text>{anime.type}</Text>
                    </Group>
                    <Group spacing={2}>
                        <IconStar size={16} stroke={1.5} />
                        <Text>{anime.score}</Text>
                    </Group>
                    <Group spacing={2}>
                        <IconCalendarTime size={16} stroke={1.5} />
                        <Text>{anime.aired.string.toString().split("to")[0]}</Text>
                    </Group>
                </Group>
                <Text lineClamp={1} size={"2rem"}>
                    {anime.titles[0].title}
                </Text>
                <Text lineClamp={1}>{`Plot Summary: ${anime.synopsis}`}</Text>
                <Button fullWidth={false} size={"md"} sx={{ width: "fit-content", marginTop: "15px", padding: "10px 20px" }} radius={100} className={classes.sliderButton} component={Link} to={`/anime/${anime.slug}`}>
                    <IconPlayerPlay size={16} stroke={1.5} />
                    <Text sx={{ marginLeft: "5px" }}>Play</Text>
                </Button>
            </div>
        </Paper>
    );
}

export default HeaderSliderLayout;
