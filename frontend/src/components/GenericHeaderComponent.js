import React from "react";
import HomeHeaderComponent from "./HomeHeaderComponent";

function GenericHeaderComponent({ type, sideBarState, setSideBarState, otherData }) {
    switch (type) {
        case "home":
            return <HomeHeaderComponent sideBarState={sideBarState} setSideBarState={setSideBarState} otherData={otherData} />;
        case "auth":
            return <></>;
        default:
            return <></>;
    }
}

export default GenericHeaderComponent;
