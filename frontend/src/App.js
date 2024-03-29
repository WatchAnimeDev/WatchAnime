import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Container } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { SpotlightProvider } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons";
import { handleSpotLightSearch } from "./custom/Search";
import Snowfall from "react-snowfall";

import HomeScreen from "./screens/HomeScreen";
import SearchLayout from "./layouts/SearchLayout";
import AnimeDetailsScreen from "./screens/AnimeDetailsScreen";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";
import GenericScreen from "./screens/GenericScreen";
import DmcaScreen from "./screens/DmcaScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import BugReportLayout from "./layouts/BugReportLayout";
import ContactScreen from "./screens/ContactScreen";
import { getOrSetUid } from "./custom/User";
import SpotlightActionComponent from "./components/SpotlightActionComponent";
import AnimeSearchScreen from "./screens/AnimeSearchScreen";
import { IS_CHRISTMAS_ENABLED } from "./constants/genricConstants";
import { isAuthPath, refreshLogin, signOut, userData } from "./custom/Auth";
import SignInLayout from "./layouts/SignInLayout";
import SignUpLayout from "./layouts/SignUpLayout";
import AuthScreen from "./screens/AuthScreen";
import PasswordResetLayout from "./layouts/PasswordResetLayout";
import GenericHeaderComponent from "./components/GenericHeaderComponent";
import GenericFooterComponent from "./components/GenericFooterComponent";

function App() {
    const [sideBarState, setSideBarState] = useState(false);
    const [bugReportState, setBugReportState] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const isPlayerPage = /\/episode\/\d+/.test(location.pathname) === true;

    const targetRefSchedule = useRef(null);

    const executeTargetRefSchedule = () => targetRefSchedule.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    const pageType = isAuthPath() ? "auth" : "home";

    useEffect(() => {
        getOrSetUid();

        const userDatas = userData();
        if (!userDatas.isAuthRecord && !isAuthPath()) {
            navigate("/signin", { replace: true });
        } else if (userDatas.isAuthRecord) {
            if (isAuthPath()) {
                navigate("/", { replace: true });
            }
            async function refreshAuth() {
                const refreshAuth = await refreshLogin();
                if (!refreshAuth) {
                    signOut();
                    navigate("/signin", { replace: true });
                }
            }
            if (!isAuthPath()) {
                refreshAuth();
            }
        }
        // eslint-disable-next-line
    }, []);

    return (
        <SpotlightProvider
            actions={searchData}
            searchIcon={<IconSearch size={18} />}
            searchPlaceholder="Search..."
            shortcut="ctrl + k"
            onChange={(e) => handleSpotLightSearch(e, setSearchData, navigate)}
            closeOnActionTrigger={true}
            cleanQueryOnClose={true}
            limit={5}
            actionComponent={SearchLayout}
            actionsWrapperComponent={SpotlightActionComponent}
        >
            <GenericHeaderComponent sideBarState={sideBarState} setSideBarState={setSideBarState} otherData={{ executeTargetRefSchedule: executeTargetRefSchedule }} type={pageType} />

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
                        <Route path="/catalog" element={<AnimeSearchScreen sideBarState={sideBarState} setSideBarState={setSideBarState} bugReportState={bugReportState} setBugReportState={setBugReportState} />}></Route>
                        <Route path="/signin" element={<AuthScreen isChristmasEnabled={IS_CHRISTMAS_ENABLED} renderComponent={<SignInLayout />} />}></Route>
                        <Route path="/signup" element={<AuthScreen isChristmasEnabled={IS_CHRISTMAS_ENABLED} renderComponent={<SignUpLayout />} />}></Route>
                        <Route path="/reset" element={<AuthScreen isChristmasEnabled={IS_CHRISTMAS_ENABLED} renderComponent={<PasswordResetLayout />} />}></Route>
                    </Routes>
                </Container>
            </main>
            <BugReportLayout bugReportState={bugReportState} setBugReportState={setBugReportState} />

            <GenericFooterComponent type={pageType} />

            {IS_CHRISTMAS_ENABLED && !isPlayerPage ? (
                <Snowfall
                    style={{
                        position: "fixed",
                        width: "100vw",
                        height: "100vh",
                        zIndex: 1000,
                    }}
                    snowflakeCount={60}
                    radius={[1.5, 3]}
                    color="white"
                />
            ) : (
                <></>
            )}
        </SpotlightProvider>
    );
}

export default App;
