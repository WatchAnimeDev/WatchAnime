import React from "react";
import HomeHeaderComponent from "./HomeHeaderComponent";

function GenericHeaderComponent({ type, sideBarState, setSideBarState, otherData, setSearchModalOpen }) {
    switch (type) {
        case "home":
        case "profile":
            return <HomeHeaderComponent sideBarState={sideBarState} setSideBarState={setSideBarState} otherData={otherData} setSearchModalOpen={setSearchModalOpen} />;
        case "auth":
            return <></>;
        default:
            return <></>;
    }
}

export default GenericHeaderComponent;
