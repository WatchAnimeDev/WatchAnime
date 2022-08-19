import { Paper } from "@mantine/core";
import React from "react";
import SliderComponent from "../components/SliderComponent";
import { getDateAndDayForMonthFromCurrentDate } from "../custom/DateTime";

function ScheduleSectionLayout() {
    const scheduleSliderConfig = {
        withControls: true,
        slideSize: "150px",
        slideGap: "10px",
        align: "start",
        includeGapInSize: false,
        loop: true,
    };
    return (
        <Paper sx={{ width: "100%" }}>
            <SliderComponent sliderDatas={getDateAndDayForMonthFromCurrentDate()} sliderRenderComponent={"ScheduleSectionLayout"} sliderConfig={scheduleSliderConfig} />
        </Paper>
    );
}

export default ScheduleSectionLayout;
