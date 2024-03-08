import React from "react";
import HomeFooterComponent from "./HomeFooterComponent";

function GenericFooterComponent({ type }) {
    switch (type) {
        case "home":
            return <HomeFooterComponent />;
        case "auth":
            return <></>;
        default:
            return <></>;
    }
}

export default GenericFooterComponent;
