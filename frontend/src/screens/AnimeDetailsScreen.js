import { Container, Loader } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AnimeDetailsOverviewComponent from "../components/AnimeDetailsOverviewComponent";
import AnimeRelationRecommendationComponent from "../components/AnimeRelationRecommendationComponent";
import SideBarComponent from "../components/SideBarComponent";
import { API_BASE_URL } from "../constants/genricConstants";

function AnimeDetailsScreen({ sideBarState, setSideBarState, otherData, params }) {
    const location = useLocation();
    const [ajaxComplete, setAjaxComplete] = useState(false);

    const [animeData, setAnimeData] = useState({});
    const [animeRecommendation, setAnimeRecommendation] = useState([]);

    useEffect(() => {
        async function getAnimeDetails() {
            setAjaxComplete(false);
            const animeSlug = location.pathname.split("/anime/")[1];
            const [animeAjaxData, animeRecommendationAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/anime/details/${animeSlug}`), axios.get(`${API_BASE_URL}/anime/recommendation/${animeSlug}`)]);
            setAnimeData(animeAjaxData.data);
            setAnimeRecommendation(animeRecommendationAjaxData.data);
            setAjaxComplete(true);
            return;
        }
        getAnimeDetails();
    }, [location.pathname]);

    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }, { label: "Random" }, { label: "Report a Problem" }, { label: "Install App" }],
    };

    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} />
            <Container fluid sx={{ margin: "10px 20px" }}>
                <AnimeDetailsOverviewComponent animeData={animeData} />
                <AnimeRelationRecommendationComponent animeRecommendation={animeRecommendation} animeData={animeData} />
            </Container>
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default AnimeDetailsScreen;
