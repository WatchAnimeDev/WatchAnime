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

function App() {
    const [sideBarState, setSideBarState] = useState(false);
    const [searchData, setSearchData] = useState([]);

    const targetRefSchedule = useRef(null);

    const executeTargetRefSchedule = () => targetRefSchedule.current.scrollIntoView();

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
                    <Container className="bodyContainer" fluid p={0}>
                        <Routes>
                            <Route path="/" element={<HomeScreen sideBarState={sideBarState} setSideBarState={setSideBarState} otherData={{ targetRefSchedule: targetRefSchedule }} />} exact></Route>
                            <Route path="/anime/:animeSlug" element={<AnimeDetailsScreen />} exact></Route>
                            <Route path="/anime/:animeSlug/episode/:episodenumber" element={<VideoPlayerScreen />} exact></Route>
                        </Routes>
                    </Container>
                </main>
            </Router>
        </SpotlightProvider>
    );
}

export default App;
