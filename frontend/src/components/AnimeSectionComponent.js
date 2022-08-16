import { Anchor, Group, Text } from "@mantine/core";
import React from "react";
import SliderComponent from "./SliderComponent";

function AnimeSectionComponent({ sectionTitle, sectionAnimeData, hasViewMore, viewMoreLink, sliderConfig, refProp }) {
    return (
        <>
            <Group sx={{ width: "100%", marginBottom: "30px" }} ref={refProp}>
                <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                    <Text sx={{ fontSize: "20px", fontWeight: "700" }}>{sectionTitle}</Text>
                    {hasViewMore && <Anchor href={`${viewMoreLink}`}>View More</Anchor>}
                </Group>
                <SliderComponent sliderDatas={sectionAnimeData} sliderRenderComponent={"AnimeSectionLayout"} sliderConfig={sliderConfig} />
            </Group>
        </>
    );
}

export default AnimeSectionComponent;
