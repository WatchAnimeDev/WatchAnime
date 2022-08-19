import React from "react";
import { Carousel } from "@mantine/carousel";
import HeaderSliderLayout from "../layouts/HeaderSliderLayout";
import AnimeSectionLayout from "../layouts/AnimeSectionLayout";
import ScheduleDateSliderPartial from "../partials/ScheduleDateSliderPartial";

const getSliderType = (sliderData, sliderRenderComponent, ind) => {
    switch (sliderRenderComponent) {
        case "HeaderSliderLayout":
            return <HeaderSliderLayout anime={sliderData} index={ind} />;
        case "AnimeSectionLayout":
            return <AnimeSectionLayout anime={sliderData} />;
        case "ScheduleSectionLayout":
            return <ScheduleDateSliderPartial dayAndDate={sliderData} />;
        default:
            return <></>;
    }
};

function SliderComponent({ sliderDatas, sliderRenderComponent, sliderConfig = {} }) {
    const slides = sliderDatas.map((sliderData, ind) => <Carousel.Slide key={ind}>{getSliderType(sliderData, sliderRenderComponent, ind)}</Carousel.Slide>);
    return <Carousel {...sliderConfig}>{slides}</Carousel>;
}

export default SliderComponent;
