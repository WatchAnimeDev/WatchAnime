import React from "react";

function DashboardBodyComponent({ activePage }) {
    switch (activePage) {
        case "notifications":
            return <>{activePage}</>;
        case "auth":
            return <></>;
        default:
            return <></>;
    }
}

export default DashboardBodyComponent;
