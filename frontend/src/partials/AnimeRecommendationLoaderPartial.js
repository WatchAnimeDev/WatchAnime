import { Group, Skeleton, Text } from "@mantine/core";
import React from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

function AnimeRecommendationLoaderPartial() {
    const { width } = useWindowDimensions();
    return (
        <Group sx={{ width: "100%", marginBottom: "30px" }}>
            <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                <Text sx={{ fontSize: "20px", fontWeight: "700" }}>{"RECOMMENDED FOR YOU"}</Text>
            </Group>
            <Group sx={{ justifyContent: "flex-start", width: "100%" }}>
                {[...Array(Math.floor(width / 230))].map((eachCard, ind) => (
                    <Skeleton height={260} width={200} key={ind} />
                ))}
            </Group>
        </Group>
    );
}

export default AnimeRecommendationLoaderPartial;
