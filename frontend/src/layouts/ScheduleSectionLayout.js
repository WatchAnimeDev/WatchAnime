import { Paper } from "@mantine/core";
import React, { useState } from "react";
import SliderComponent from "../components/SliderComponent";
import { getDateAndDayForMonthFromCurrentDate } from "../custom/DateTime";
import ScheduleForSelectedDatePartial from "../partials/ScheduleForSelectedDatePartial";

function ScheduleSectionLayout({ scheduleData }) {
    const [selectedDate, setSelectedDate] = useState({ dateObj: new Date() });
    const scheduleSliderConfig = {
        withControls: true,
        slideSize: "150px",
        slideGap: "10px",
        align: "start",
        includeGapInSize: false,
        loop: true,
        initialSlide: new Date().getDate() - 2,
    };
    return (
        <Paper sx={{ width: "100%" }}>
            <SliderComponent sliderDatas={getDateAndDayForMonthFromCurrentDate()} sliderRenderComponent={"ScheduleSectionLayout"} sliderConfig={scheduleSliderConfig} otherData={{ setSelectedDate: setSelectedDate }} />
            <ScheduleForSelectedDatePartial scheduleData={scheduleData} selectedDate={selectedDate} />
        </Paper>
    );
}

export default ScheduleSectionLayout;
