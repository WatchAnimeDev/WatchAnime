import React, { useEffect, useState } from "react";
import { getCurrentTime } from "../custom/DateTime";

function ScheduleTimerPartial() {
    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);
    return <div>{currentTime}</div>;
}

export default ScheduleTimerPartial;
