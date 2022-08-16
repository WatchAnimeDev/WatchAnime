import React from "react";
import { createStyles, Paper, Text, Title, Button } from "@mantine/core";
import { getAnimeTitleByRelevance, getImageByRelevance } from "../custom/AnimeData";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    card: {
        height: 260,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 600,
        color: theme.white,
        lineHeight: 1.2,
        fontSize: 14,
        marginTop: theme.spacing.xs,
    },

    category: {
        color: theme.white,
        opacity: 0.7,
        fontWeight: 700,
        textTransform: "uppercase",
        textDecoration: "none",
    },
}));

function Card({ image, title, category }) {
    const { classes } = useStyles();

    return (
        <Paper shadow="md" p="xl" radius="md" sx={{ backgroundImage: `url(${image})` }} className={classes.card}>
            <div>
                <Text className={classes.category} size="xs">
                    {category}
                </Text>
                <Title order={3} className={classes.title}>
                    {title}
                </Title>
            </div>
            <Button variant="white" color="dark">
                Read article
            </Button>
        </Paper>
    );
}

function AnimeSectionLayout({ anime }) {
    const animeTitle = getAnimeTitleByRelevance(anime.titles, anime.slug.includes("dub"));
    return (
        <Link to={`/anime/${anime.slug}${anime.currentReleasedEpisode ? `/episode/${anime.currentReleasedEpisode}` : ""}`}>
            <Card {...{ image: getImageByRelevance(anime.images, "image_url"), title: animeTitle, category: animeTitle.includes("dub") ? "DUB" : "SUB" }} />
        </Link>
    );
}

export default AnimeSectionLayout;
