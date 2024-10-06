import React from "react";
import HomeFooterComponent from "./HomeFooterComponent";

function GenericFooterComponent({ type }) {
    switch (type) {
        case "home":
        case "profile":
            return <HomeFooterComponent />;
        case "auth":
            return <></>;
        default:
            return <></>;
    }
}

export default GenericFooterComponent;
