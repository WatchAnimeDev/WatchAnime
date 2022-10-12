import { Anchor, createStyles, Group, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons";
import React from "react";
import { WATCHANIME_RED } from "../constants/cssConstants";
import SliderComponent from "./SliderComponent";

const useStyles = createStyles((theme) => ({
    viewMore: {
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        color: "#C1C2C5",
        "&:hover": {
            textDecoration: "none",
            color: WATCHANIME_RED,
        },
    },
}));

function AnimeSectionComponent({ sectionTitle, sectionAnimeData, hasViewMore, viewMoreLink, sliderConfig, refProp, otherData }) {
    const { classes } = useStyles();
    return (
        <>
            <Group sx={{ width: "100%", marginBottom: "30px" }} ref={refProp}>
                <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                    <Text sx={{ fontSize: "20px", fontWeight: "700" }}>{sectionTitle}</Text>
                    {hasViewMore && (
                        <Anchor className={classes.viewMore} href={`${viewMoreLink}`}>
                            <Text size={13} transform={"uppercase"}>
                                View More
                            </Text>
                            <IconChevronRight stroke={1.5} size={13} />
                        </Anchor>
                    )}
                </Group>
                <SliderComponent sliderDatas={sectionAnimeData} sliderRenderComponent={"AnimeSectionLayout"} sliderConfig={sliderConfig} otherData={otherData} />
            </Group>
        </>
    );
}

export default AnimeSectionComponent;
