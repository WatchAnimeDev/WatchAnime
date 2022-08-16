import React from "react";
import { Carousel } from "@mantine/carousel";
import HeaderSliderLayout from "../layouts/HeaderSliderLayout";
import AnimeSectionLayout from "../layouts/AnimeSectionLayout";

function SliderComponent({ sliderDatas, sliderRenderComponent, sliderConfig = {} }) {
    const slides = sliderDatas.map((sliderData, ind) => (
        <Carousel.Slide key={ind}>{sliderRenderComponent === "HeaderSliderLayout" ? <HeaderSliderLayout anime={sliderData} index={ind} /> : sliderRenderComponent === "AnimeSectionLayout" ? <AnimeSectionLayout anime={sliderData} /> : <></>}</Carousel.Slide>
    ));
    return <Carousel {...sliderConfig}>{slides}</Carousel>;
}

export default SliderComponent;
