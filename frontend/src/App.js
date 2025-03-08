import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Container } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import Snowfall from "react-snowfall";

import HomeScreen from "./screens/HomeScreen";
import AnimeDetailsScreen from "./screens/AnimeDetailsScreen";
import VideoPlayerScreen from "./screens/VideoPlayerScreen";
import GenericScreen from "./screens/GenericScreen";
import DmcaScreen from "./screens/DmcaScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import BugReportLayout from "./layouts/BugReportLayout";
import ContactScreen from "./screens/ContactScreen";
import { getOrSetUid } from "./custom/User";
import AnimeSearchScreen from "./screens/AnimeSearchScreen";
import { IS_CHRISTMAS_ENABLED } from "./constants/genricConstants";
import { refreshLogin, signOut, userData } from "./custom/Auth";
import SignInLayout from "./layouts/SignInLayout";
import SignUpLayout from "./layouts/SignUpLayout";
import AuthScreen from "./screens/AuthScreen";
import PasswordResetLayout from "./layouts/PasswordResetLayout";
import GenericHeaderComponent from "./components/GenericHeaderComponent";
import GenericFooterComponent from "./components/GenericFooterComponent";
import { isResetPage, resetData } from "./custom/ResetData";
import { useShallow } from "zustand/react/shallow";
import { useWatchListStore } from "./store/WatchListStore";
import { getPathType } from "./custom/Path";
import DashboardScreen from "./screens/DashboardScreen";
import SearchScreen from "./screens/SearchScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import PageNotFoundScreen from "./screens/PageNotFoundScreen";

function App() {
    const [sideBarState, setSideBarState] = useState(false);
    const [bugReportState, setBugReportState] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const { fetchWatchListData } = useWatchListStore(useShallow((state) => ({ fetchWatchListData: state.fetchWatchListData })));

    const navigate = useNavigate();
    const location = useLocation();
    const isPlayerPage = /\/episode\/\d+/.test(location.pathname) === true;

    const targetRefSchedule = useRef(null);

    const executeTargetRefSchedule = () => targetRefSchedule.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    const pageType = getPathType();

    useEffect(() => {
        getOrSetUid();
        const userDatas = userData();
        const isAuthPage = pageType === "auth";
        //If on reset page reset all data and redirect to login
        if (isResetPage()) {
            resetData();
            navigate("/signin", { replace: true });
        } else if (!userDatas.isAuthRecord && !isAuthPage) {
            // If not logged in redirect to login
            navigate("/signin", { replace: true });
        } else if (userDatas.isAuthRecord) {
            //If logged in and on auth path redirect to home
            if (isAuthPage) {
                navigate("/", { replace: true });
            }
            async function refreshAuth() {
                const refreshAuth = await refreshLogin();
                if (!refreshAuth) {
                    signOut();
                    navigate("/signin", { replace: true });
                }
                await fetchWatchListData();
            }
            //Refresh auth if not on auth path
            if (!isAuthPage) {
                refreshAuth();
            }
        }
        // eslint-disable-next-line
    }, []);
    return (
        <>
            <GenericHeaderComponent sideBarState={sideBarState} setSideBarState={setSideBarState} otherData={{ executeTargetRefSchedule: executeTargetRefSchedule }} type={pageType} setSearchModalOpen={setSearchModalOpen} />

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
                        <Route path="/dashboard/:pageType?" element={<DashboardScreen isChristmasEnabled={IS_CHRISTMAS_ENABLED} />}></Route>
                        <Route
                            path="/profile/:userName?"
                            element={<UserProfileScreen isChristmasEnabled={IS_CHRISTMAS_ENABLED} sideBarState={sideBarState} setSideBarState={setSideBarState} bugReportState={bugReportState} setBugReportState={setBugReportState} />}
                        ></Route>
                        <Route path="*" element={<PageNotFoundScreen />} />
                    </Routes>
                </Container>
            </main>
            <BugReportLayout bugReportState={bugReportState} setBugReportState={setBugReportState} />

            <SearchScreen searchModalOpen={searchModalOpen} setSearchModalOpen={setSearchModalOpen} />

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
        </>
    );
}

export default App;
