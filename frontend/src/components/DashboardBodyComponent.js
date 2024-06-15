import React from "react";
import DashboardNotificationLayout from "../layouts/DashboardNotificationLayout";
import DashboardMalLayout from "../layouts/DashboardMalLayout";
import InformationPikachuPartial from "../partials/InformationPikachuPartial";

function DashboardBodyComponent({ activePage }) {
    switch (activePage) {
        case "notifications":
            return <DashboardNotificationLayout />;
        case "mal":
            return <DashboardMalLayout />;
        default:
            return <InformationPikachuPartial message={"Coming Soon"} />;
    }
}

export default DashboardBodyComponent;
