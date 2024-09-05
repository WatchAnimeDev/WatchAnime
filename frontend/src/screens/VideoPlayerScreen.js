import { Container, Loader } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideBarComponent from "../components/SideBarComponent";
import VideoPlayerComponent from "../components/VideoPlayerComponent";
import { API_BASE_URL } from "../constants/genricConstants";
import { getWatchHistory } from "../custom/CloudSync";
import { getProxyDetails } from "../custom/UserDefinedProxy";

function VideoPlayerScreen({ sideBarState, setSideBarState, bugReportState, setBugReportState }) {
    const location = useLocation();
    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [episodeData, setEpisodeData] = useState({});
    const [episodeDecoderData, setEpisodeDecoderData] = useState({});
    const [watchHistoryData, setWatchHistoryData] = useState({});
    const [userDefinedProxyUrl, setUserDefinedProxyUrl] = useState("");

    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }],
    };

    useEffect(() => {
        async function getAnimeDetails() {
            setAjaxComplete(false);
            const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
            const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];
            const [episodeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/sources/${animeSlug}/${episodeNumber}`)]);
            setEpisodeData(episodeAjaxData.data);
            const [episodeAnimeAjaxData, watchHistoryData, { url, useProxy }] = await Promise.all([axios.get(`${API_BASE_URL}/episode/decoder/${animeSlug}/${episodeNumber}/${"Alpha"}`), getWatchHistory(animeSlug), getProxyDetails()]);
            setEpisodeDecoderData(episodeAnimeAjaxData.data);
            setWatchHistoryData(watchHistoryData);
            if (useProxy) {
                setUserDefinedProxyUrl(url);
            }
            setAjaxComplete(true);

            return;
        }
        getAnimeDetails();
    }, [location.pathname]);

    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ bugReportState, setBugReportState }} />
            <Container fluid sx={{ margin: "10px 20px" }}>
                <VideoPlayerComponent episodeData={episodeData} episodeDecoderData={episodeDecoderData} watchHistoryData={watchHistoryData} userDefinedProxyUrl={userDefinedProxyUrl} />
            </Container>
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default VideoPlayerScreen;
