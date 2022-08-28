import { Container, Loader } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SideBarComponent from "../components/SideBarComponent";
import VideoPlayerComponent from "../components/VideoPlayerComponent";
import { API_BASE_URL } from "../constants/genricConstants";

function VideoPlayerScreen({ sideBarState, setSideBarState }) {
    const location = useLocation();
    const firstRender = useRef(true);
    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [episodeData, setEpisodeData] = useState({});
    const [episodeDecoderData, setEpisodeDecoderData] = useState({});
    const [selectedServer, setSelectedServer] = useState("Alpha");

    const handleServerChange = () => {
        setSelectedServer("Xstreamcdn");
    };

    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }, { label: "Random" }, { label: "Report a Problem" }, { label: "Install App" }],
    };

    useEffect(() => {
        async function getAnimeDetails() {
            setAjaxComplete(false);
            const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
            const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];
            const [episodeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/sources/${animeSlug}/${episodeNumber}`)]);
            setEpisodeData(episodeAjaxData.data);
            const [episodeAnimeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/decoder/${animeSlug}/${episodeNumber}/${selectedServer}`)]);
            setEpisodeDecoderData(episodeAnimeAjaxData.data);
            setAjaxComplete(true);

            return;
        }
        getAnimeDetails();
    }, [location.pathname]);

    useEffect(() => {
        async function getAnimeDetails() {
            const animeSlug = location.pathname.split("/anime/")[1].split("/")[0];
            const episodeNumber = location.pathname.split("/anime/")[1].split("/")[2];
            const [episodeAnimeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/episode/decoder/${animeSlug}/${episodeNumber}/${selectedServer}`)]);
            setEpisodeDecoderData(episodeAnimeAjaxData.data);

            return;
        }
        if (!firstRender.current) {
            getAnimeDetails();
        } else {
            firstRender.current = false;
        }
    }, [selectedServer]);

    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} />
            <Container fluid sx={{ margin: "10px 20px" }}>
                <VideoPlayerComponent episodeData={episodeData} episodeDecoderData={episodeDecoderData} selectedServer={selectedServer} />
            </Container>
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default VideoPlayerScreen;
