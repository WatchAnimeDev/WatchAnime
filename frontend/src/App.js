import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mantine/core";
import { useRef, useState } from "react";
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

function App() {
    const [sideBarState, setSideBarState] = useState(false);
    const [searchData, setSearchData] = useState([]);

    const targetRefSchedule = useRef(null);

    const executeTargetRefSchedule = () => targetRefSchedule.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    return (
        <SpotlightProvider
            actions={searchData}
            searchIcon={<IconSearch size={18} />}
            searchPlaceholder="Search..."
            shortcut="ctrl + k"
            nothingFoundMessage="Nothing found..."
            onChange={(e) => handleSpotLightSearch(e, setSearchData)}
            closeOnActionTrigger={true}
            cleanQueryOnClose={true}
            limit={5}
            actionComponent={SearchLayout}
        >
            <Router>
                <HeaderComponent sideBarState={sideBarState} setSideBarState={setSideBarState} otherData={{ executeTargetRefSchedule: executeTargetRefSchedule }} />
                <main className="py-3">
                    <Container className="bodyContainer" fluid p={0} sx={{ minHeight: "80vh" }}>
                        <Routes>
                            <Route path="/" element={<HomeScreen sideBarState={sideBarState} setSideBarState={setSideBarState} otherData={{ targetRefSchedule: targetRefSchedule }} />} exact></Route>
                            <Route path="/anime/:animeSlug" element={<AnimeDetailsScreen sideBarState={sideBarState} setSideBarState={setSideBarState} otherData={{}} />} exact></Route>
                            <Route path="/anime/:animeSlug/episode/:episodenumber" element={<VideoPlayerScreen />} exact></Route>
                            <Route path="/recent/:pageNumber" element={<GenericScreen pageType={"recent"} hasPagination={true} />}></Route>
                            <Route path="/popular/:pageNumber" element={<GenericScreen pageType={"popular"} hasPagination={true} />}></Route>
                        </Routes>
                    </Container>
                </main>
                <FooterComponent />
            </Router>
        </SpotlightProvider>
    );
}

export default App;
