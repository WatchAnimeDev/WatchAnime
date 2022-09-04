import { createStyles, Drawer, Group } from "@mantine/core";

import React from "react";
import SideBarMenuLayout from "../layouts/SideBarMenuLayout";

const useStyles = createStyles((theme) => ({
    sideBarGroup: {
        display: "flex",
        flexWrap: "wrap",
        marginTop: "14px",
        gap: "0px",
    },
}));

function SideBarComponent({ sideBarState, setSideBarState, sideBarComponentConfig = {}, otherData = {} }) {
    const { classes } = useStyles();
    sideBarComponentConfig = specificActionsOnSideBarComponentType(sideBarComponentConfig.type, sideBarComponentConfig, otherData);
    const sideBarItems = sideBarComponentConfig.data.map((data, ind) => {
        return sideBarComponentConfig.type === "SideBarMenuLayout" ? <SideBarMenuLayout menuData={data} key={ind} setSideBarState={setSideBarState} /> : <></>;
    });

    return (
        <Drawer opened={sideBarState} onClose={() => setSideBarState(false)} title={sideBarComponentConfig.title ?? ""} padding="xl" size="260px">
            <Group className={classes.sideBarGroup}>{sideBarItems}</Group>
        </Drawer>
    );
}

function specificActionsOnSideBarComponentType(componentType, sideBarComponentConfig, otherData) {
    switch (componentType) {
        case "SideBarMenuLayout":
            sideBarComponentConfig.data = [
                ...sideBarComponentConfig.data,
                ...[
                    {
                        label: "Report a Problem",
                        callBack: () => {
                            otherData.setBugReportState(!otherData.bugReportState);
                        },
                    },
                    { label: "Install App" },
                ],
            ];
            return sideBarComponentConfig;
        default:
            return sideBarComponentConfig;
    }
}

export default SideBarComponent;
