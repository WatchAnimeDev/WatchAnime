import { Paper, useMantineTheme } from "@mantine/core";
import { IconPencil } from "@tabler/icons";
import React, { useState } from "react";
import SideBarComponent from "./SideBarComponent";
import { useMediaQuery } from "@mantine/hooks";

function WatchListEditComponent({ watchListData, setWatchListData }) {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
    const [isWatchListEditorOpen, setisWatchListEditorOpen] = useState(false);

    const sideBarComponentConfigForSideBarMenu = {
        title: "Reorder WatchList",
        type: "SideBarWatchlistEditor",
        data: [watchListData],
        size: mobile ? "100%" : "350px",
    };
    return (
        <Paper>
            <Paper sx={{ display: "flex", cursor: "pointer" }} onClick={(e) => setisWatchListEditorOpen(true)}>
                <IconPencil size={16} />
            </Paper>
            <SideBarComponent sideBarState={isWatchListEditorOpen} setSideBarState={setisWatchListEditorOpen} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ setWatchListData: setWatchListData }} />
        </Paper>
    );
}

export default WatchListEditComponent;
