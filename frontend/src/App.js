import { Route, Routes, useNavigate } from "react-router-dom";
import { Container } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { SpotlightProvider } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons";
import { handleSpotLightSearch } from "./custom/Search";

import HomeScreen from "./screens/HomeScreen";
import HeaderComponent from "./components/HeaderComponent";
import SearchLayout from "./layouts/SearchLayout";
import AnimeDetailsScreen from "./screens/AnimeDetailsScreen";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";
import FooterComponent from "./components/FooterComponent";
import GenericScreen from "./screens/GenericScreen";
import DmcaScreen from "./screens/DmcaScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import BugReportLayout from "./layouts/BugReportLayout";
import ContactScreen from "./screens/ContactScreen";
import { getOrSetUid } from "./custom/User";

function App() {
    const [sideBarState, setSideBarState] = useState(false);
    const [bugReportState, setBugReportState] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const navigate = useNavigate();

    const targetRefSchedule = useRef(null);

    const executeTargetRefSchedule = () => targetRefSchedule.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    useEffect(() => {
        getOrSetUid();
    }, []);

    return (
        <SpotlightProvider
            actions={searchData}
            searchIcon={<IconSearch size={18} />}
            searchPlaceholder="Search..."
            shortcut="ctrl + k"
            nothingFoundMessage="Nothing found..."
            onChange={(e) => handleSpotLightSearch(e, setSearchData, navigate)}
            closeOnActionTrigger={true}
            cleanQueryOnClose={true}
            limit={5}
            actionComponent={SearchLayout}
        >
            <HeaderComponent sideBarState={sideBarState} setSideBarState={setSideBarState} otherData={{ executeTargetRefSchedule: executeTargetRefSchedule }} />
            <main className="py-3">
                <Container className="bodyContainer" fluid p={0} sx={{ minHeight: "81vh" }}>
                    <Routes>
                        <Route
                            path="/"
                            element={<HomeScreen sideBarState={sideBarState} setSideBarState={setSideBarState} bugReportState={bugReportState} setBugReportState={setBugReportState} otherData={{ targetRefSchedule: targetRefSchedule }} />}
                            exact
                        ></Route>
                        <Route path="/anime/:animeSlug" element={<AnimeDetailsScreen sideBarState={sideBarState} setSideBarState={setSideBarState} bugReportState={bugReportState} setBugReportState={setBugReportState} />} exact></Route>
                        <Route
                            path="/anime/:animeSlug/episode/:episodenumber"
                            element={<VideoPlayerScreen sideBarState={sideBarState} setSideBarState={setSideBarState} bugReportState={bugReportState} setBugReportState={setBugReportState} />}
                            exact
                        ></Route>
                        <Route
                            path="/recent/:pageNumber"
                            element={<GenericScreen sideBarState={sideBarState} setSideBarState={setSideBarState} pageType={"recent"} hasPagination={true} bugReportState={bugReportState} setBugReportState={setBugReportState} />}
                        ></Route>
                        <Route
                            path="/popular/:pageNumber"
                            element={<GenericScreen sideBarState={sideBarState} setSideBarState={setSideBarState} pageType={"popular"} hasPagination={true} bugReportState={bugReportState} setBugReportState={setBugReportState} />}
                        ></Route>
                        <Route path="/dmca" element={<DmcaScreen sideBarState={sideBarState} setSideBarState={setSideBarState} bugReportState={bugReportState} setBugReportState={setBugReportState} />}></Route>
                        <Route path="/privacy" element={<PrivacyPolicyScreen sideBarState={sideBarState} setSideBarState={setSideBarState} bugReportState={bugReportState} setBugReportState={setBugReportState} />}></Route>
                        <Route path="/contact" element={<ContactScreen sideBarState={sideBarState} setSideBarState={setSideBarState} bugReportState={bugReportState} setBugReportState={setBugReportState} />}></Route>
                    </Routes>
                </Container>
            </main>
            <BugReportLayout bugReportState={bugReportState} setBugReportState={setBugReportState} />
            <FooterComponent />
        </SpotlightProvider>
    );
}

export default App;
