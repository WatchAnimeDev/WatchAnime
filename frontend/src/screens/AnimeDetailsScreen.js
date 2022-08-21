import { Loader } from "@mantine/core";
import React, { useState } from "react";
import SideBarComponent from "../components/SideBarComponent";

function AnimeDetailsScreen({ sideBarState, setSideBarState, otherData }) {
    const [ajaxComplete, setAjaxComplete] = useState(true);
    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home" }, { label: "Random" }, { label: "Report a Problem" }, { label: "Install App" }],
    };
    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} />
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default AnimeDetailsScreen;
