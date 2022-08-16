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

function SideBarComponent({ sideBarState, setSideBarState, sideBarComponentConfig = {} }) {
    const { classes } = useStyles();

    const sideBarItems = sideBarComponentConfig.data.map((data, ind) => {
        return sideBarComponentConfig.type === "SideBarMenuLayout" ? <SideBarMenuLayout menuData={data} key={ind} /> : <></>;
    });

    return (
        <Drawer opened={sideBarState} onClose={() => setSideBarState(false)} title={sideBarComponentConfig.title ?? ""} padding="xl" size="260px">
            <Group className={classes.sideBarGroup}>{sideBarItems}</Group>
        </Drawer>
    );
}

export default SideBarComponent;
