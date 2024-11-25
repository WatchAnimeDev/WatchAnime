import React from "react";
import DashboardNotificationLayout from "../layouts/DashboardNotificationLayout";
import DashboardMalLayout from "../layouts/DashboardMalLayout";
import InformationPikachuPartial from "../partials/InformationPikachuPartial";
import DashboardWatchlistLayout from "../layouts/DashboardWatchlistLayout";
import DashboardOtherSettingsLayout from "../layouts/DashboardOtherSettingsLayout";
import DashboardProfileLayout from "../layouts/DashboardProfileLayout";

function DashboardBodyComponent({ activePage }) {
    switch (activePage) {
        case "notifications":
            return <DashboardNotificationLayout />;
        case "mal":
            return <DashboardMalLayout />;
        case "watchlist":
            return <DashboardWatchlistLayout />;
        case "settings":
            return <DashboardOtherSettingsLayout />;
        case "profile":
            return <DashboardProfileLayout />;
        default:
            return <InformationPikachuPartial message={"Coming Soon"} />;
    }
}

export default DashboardBodyComponent;