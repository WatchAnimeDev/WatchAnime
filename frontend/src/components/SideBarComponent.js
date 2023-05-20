import { createStyles, Drawer, Group } from "@mantine/core";
import axios from "axios";

import React from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants/genricConstants";
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
    const navigate = useNavigate();

    sideBarComponentConfig = specificActionsOnSideBarComponentType(sideBarComponentConfig.type, sideBarComponentConfig, { ...otherData, ...{ navigate: navigate } });
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
                        label: "Search",
                        callBack: () => {
                            otherData.navigate(`/search`);
                        },
                    },
                    {
                        label: "Random",
                        callBack: async () => {
                            const animeData = await Promise.all([axios.get(`${API_BASE_URL}/anime/random`)]);
                            otherData.navigate(`/anime/${animeData[0].data.slug}`);
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
