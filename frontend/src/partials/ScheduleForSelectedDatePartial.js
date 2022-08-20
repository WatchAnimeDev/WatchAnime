import React from "react";
import { Group, Text, UnstyledButton } from "@mantine/core";
import { IconDeviceTv } from "@tabler/icons";
import { Link } from "react-router-dom";
function ScheduleForSelectedDatePartial({ scheduleData, selectedDate }) {
    return (
        <Group mt={30} sx={{ gap: 0 }}>
            {scheduleData
                .filter((schedule) => schedule.daynum === selectedDate.dateObj.getDay())
                .sort((first, second) => {
                    return first.timeday.includes("PM") && !second.timeday.includes("PM") ? 1 : !first.timeday.includes("PM") && second.timeday.includes("PM") ? -1 : first.timeday.split(":")[0] > second.timeday.split(":")[0] ? 1 : -1;
                })
                .map((schedule, ind) => {
                    return (
                        <Group key={ind} sx={{ width: "100%", backgroundColor: `${ind % 2 === 0 ? "rgb(37, 38, 43)" : "#2A2B2C"}`, flexWrap: "nowrap" }} p="sm">
                            <Text sx={{ width: "18%" }}>{schedule.timeday}</Text>
                            <Text sx={{ width: "70%" }} lineClamp={1}>
                                {schedule.name}
                            </Text>
                            <UnstyledButton sx={{ padding: "10px", backgroundColor: "rgb(26, 27, 30)", borderRadius: "10px", display: "flex", alignItems: "center" }} component={Link} to={`/anime/${schedule.slug}`}>
                                <IconDeviceTv size={16} stroke={1.5} />
                                <Text pl={5}>Watch</Text>
                            </UnstyledButton>
                        </Group>
                    );
                })}
        </Group>
    );
}

export default ScheduleForSelectedDatePartial;
