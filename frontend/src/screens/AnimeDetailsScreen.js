import { Container, Loader } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AnimeDetailsOverviewComponent from "../components/AnimeDetailsOverviewComponent";
import AnimeRelationRecommendationComponent from "../components/AnimeRelationRecommendationComponent";
import SideBarComponent from "../components/SideBarComponent";
import { API_BASE_URL } from "../constants/genricConstants";

function AnimeDetailsScreen({ sideBarState, setSideBarState, bugReportState, setBugReportState }) {
    const location = useLocation();
    const [ajaxComplete, setAjaxComplete] = useState(false);

    const [animeData, setAnimeData] = useState({});

    useEffect(() => {
        async function getAnimeDetails() {
            setAjaxComplete(false);
            const animeSlug = location.pathname.split("/anime/")[1];
            const [animeAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}/anime/details/${animeSlug}`)]);
            setAnimeData(animeAjaxData.data);
            setAjaxComplete(true);
            return;
        }
        getAnimeDetails();
    }, [location.pathname]);

    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }, { label: "Random" }],
    };

    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ bugReportState, setBugReportState }} />
            <Container fluid sx={{ margin: "10px 20px" }}>
                <AnimeDetailsOverviewComponent animeData={animeData} />
                <AnimeRelationRecommendationComponent animeData={animeData} />
            </Container>
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default AnimeDetailsScreen;
