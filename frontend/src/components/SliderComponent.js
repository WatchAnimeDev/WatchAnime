import React from "react";
import { Carousel } from "@mantine/carousel";
import HeaderSliderLayout from "../layouts/HeaderSliderLayout";
import AnimeSectionLayout from "../layouts/AnimeSectionLayout";
import ScheduleDateSliderPartial from "../partials/ScheduleDateSliderPartial";

const getSliderType = (sliderData, sliderRenderComponent, ind, otherData) => {
    switch (sliderRenderComponent) {
        case "HeaderSliderLayout":
            return <HeaderSliderLayout anime={sliderData} index={ind} />;
        case "AnimeSectionLayout":
            return (
                <AnimeSectionLayout
                    anime={sliderData}
                    isDeletable={otherData.isDeletable ?? false}
                    isAddableToWatchList={otherData.isAddableToWatchList ?? false}
                    reRenderLastWatched={otherData.reRenderLastWatched}
                    setReRenderLastWatched={otherData.setReRenderLastWatched}
                    featureId={otherData.featureId ?? null}
                    reRenderHomepage={otherData.reRenderHomepage}
                    setReRenderHomepage={otherData.setReRenderHomepage}
                />
            );
        case "ScheduleSectionLayout":
            return <ScheduleDateSliderPartial dayAndDate={sliderData} setSelectedDate={otherData.setSelectedDate} />;
        default:
            return <></>;
    }
};

function SliderComponent({ sliderDatas, sliderRenderComponent, sliderConfig, otherData = {} }) {
    const slides = sliderDatas.map((sliderData, ind) => <Carousel.Slide key={ind}>{getSliderType(sliderData, sliderRenderComponent, ind, otherData)}</Carousel.Slide>);
    return <Carousel {...sliderConfig}>{slides}</Carousel>;
}

export default SliderComponent;
