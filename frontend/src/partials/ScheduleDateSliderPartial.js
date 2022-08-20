import { Group } from "@mantine/core";
import React, { useRef } from "react";

function ScheduleDateSliderPartial({ dayAndDate, setSelectedDate }) {
    const schduleSliderDivRef = useRef();

    const handleScheduleClick = (dayAndDate, schduleSliderDivRef) => {
        schduleSliderDivRef.current.parentNode.parentNode.childNodes.forEach((x) => x.childNodes[0].classList.remove("bg-red"));
        schduleSliderDivRef.current.classList.add("bg-red");
        setSelectedDate(dayAndDate);
    };

    return (
        <Group
            key={dayAndDate.date}
            sx={{ display: "flex", flexDirection: "column", gap: "5px", padding: "5px 3%", backgroundColor: "#353738", borderRadius: "10px" }}
            onClick={(e) => handleScheduleClick(dayAndDate, schduleSliderDivRef)}
            ref={schduleSliderDivRef}
            className={dayAndDate.dateObj.getDate() === new Date().getDate() && "bg-red"}
        >
            <span>{dayAndDate.day.toUpperCase()}</span>
            <span>{dayAndDate.date}</span>
        </Group>
    );
}

export default ScheduleDateSliderPartial;
