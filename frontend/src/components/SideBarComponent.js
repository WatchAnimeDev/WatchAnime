import { createStyles, Drawer, Group, Paper } from "@mantine/core";

import React from "react";
import { useNavigate } from "react-router-dom";
import SideBarMenuLayout from "../layouts/SideBarMenuLayout";
import WatchListEditLayout from "../layouts/WatchListEditLayout";

const useStyles = createStyles((theme) => ({
    sideBarGroup: {
        display: "flex",
        flexWrap: "wrap",
        marginTop: "14px",
        gap: "0px",
        width: "100%",
    },
    drawerHeader: {
        margin: "16px",
    },
}));

function SideBarComponent({ sideBarState, setSideBarState, sideBarComponentConfig = {}, otherData = {} }) {
    const { classes } = useStyles();
    const navigate = useNavigate();

    sideBarComponentConfig = specificActionsOnSideBarComponentType(sideBarComponentConfig.type, sideBarComponentConfig, { ...otherData, ...{ navigate: navigate } });
    var sideBarItems = <Paper></Paper>;
    switch (sideBarComponentConfig.type) {
        case "SideBarMenuLayout":
            sideBarItems = <SideBarMenuLayout sideBarComponentConfig={sideBarComponentConfig} setSideBarState={setSideBarState} />;
            break;
        case "SideBarWatchlistEditor":
            sideBarItems = <WatchListEditLayout watchListData={sideBarComponentConfig.data[0]} {...otherData} />;
            break;
        default:
            break;
    }

    return (
        <Drawer
            opened={sideBarState}
            onClose={() => setSideBarState(false)}
            title={sideBarComponentConfig.title ?? ""}
            size={sideBarComponentConfig.size ?? "300px"}
            withCloseButton={sideBarComponentConfig.withCloseButton ?? true}
            classNames={{ header: classes.drawerHeader }}
        >
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
                        label: "Catalog",
                        callBack: () => {
                            otherData.navigate(`/catalog`);
                        },
                    },
                    {
                        label: "Report a Problem",
                        callBack: () => {
                            otherData.setBugReportState(!otherData.bugReportState);
                        },
                    },
                ],
            ];
            return sideBarComponentConfig;
        default:
            return sideBarComponentConfig;
    }
}

export default SideBarComponent;
