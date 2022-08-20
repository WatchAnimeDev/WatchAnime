import { createStyles, Group, Text } from "@mantine/core";
import React from "react";
import { getCurrentDate, getTimeZoneOffesetFromGMT } from "../custom/DateTime";
import ScheduleSectionLayout from "../layouts/ScheduleSectionLayout";
import ScheduleTimerPartial from "../partials/ScheduleTimerPartial";

const useStyles = createStyles((theme) => ({
    scheduleCurrentTimeParent: {
        lineHeight: "28px",
        padding: "0 10px",
        backgroundColor: "rgb(37, 38, 43)",
        borderRadius: "40px",
        margin: "6px 0",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
    },
    scheduleCurrentTimeDate: {
        padding: "0px 5px",
    },
}));

function ScheduleComponent({ scheduleData, targetRefSchedule }) {
    const { classes } = useStyles();

    return (
        <Group sx={{ width: "100%", marginBottom: "30px" }} ref={targetRefSchedule}>
            <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                <Text sx={{ fontSize: "20px", fontWeight: "700" }}>Estimated Schedule</Text>
                <div className={classes.scheduleCurrentTimeParent}>
                    <div>GMT{getTimeZoneOffesetFromGMT()}</div>
                    <div className={classes.scheduleCurrentTimeDate}>{getCurrentDate()}</div>
                    <ScheduleTimerPartial />
                </div>
            </Group>
            <Group sx={{ width: "100%" }}>
                <ScheduleSectionLayout scheduleData={scheduleData} />
            </Group>
        </Group>
    );
}

export default ScheduleComponent;
