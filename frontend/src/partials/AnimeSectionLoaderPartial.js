import { Group, Skeleton, Text } from "@mantine/core";
import React from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

function AnimeSectionLoaderPartial({ loaderTitle, skeletonHeight, skeletonWidth }) {
    const { width } = useWindowDimensions();
    return (
        <Group sx={{ width: "100%", marginBottom: "30px" }}>
            <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                <Text sx={{ fontSize: "20px", fontWeight: "700" }}>{loaderTitle}</Text>
            </Group>
            <Group sx={{ justifyContent: "flex-start", width: "100%" }}>
                {[...Array(Math.floor(width / (skeletonWidth + 30)))].map((eachCard, ind) => (
                    <Skeleton height={skeletonHeight} width={skeletonWidth} key={ind} />
                ))}
            </Group>
        </Group>
    );
}

export default AnimeSectionLoaderPartial;
