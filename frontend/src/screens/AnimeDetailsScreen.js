import { Container, Loader } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AnimeDetailsEpisodeListComponent from "../components/AnimeDetailsEpisodeListComponent";
import AnimeDetailsOverviewComponent from "../components/AnimeDetailsOverviewComponent";
import SideBarComponent from "../components/SideBarComponent";
import AnimeMalForumComponent from "../components/AnimeMalForumComponent";
import AnimeRelationComponent from "../components/AnimeRelationComponent";
import AnimeRecommendationComponent from "../components/AnimeRecommendationComponent";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { AnimeQueryObject } from "../graphql/graphqlQueries";
import AnimeDetailsSubDubComponent from "../components/AnimeDetailsSubDubComponent";

function AnimeDetailsScreen({ sideBarState, setSideBarState, bugReportState, setBugReportState }) {
    const location = useLocation();
    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [episodeInfoData, setEpisodeInfoData] = useState({});

    const [animeData, setAnimeData] = useState({});

    useEffect(() => {
        async function getAnimeDetails() {
            setAjaxComplete(false);
            const animeSlug = location.pathname.split("/anime/")[1].replace("/", "");
            const [animeAjaxData] = await Promise.all([execGraphqlQuery(AnimeQueryObject, { slug: animeSlug })]);
            setAnimeData(animeAjaxData.data.data.Page.media[0]);
            setAjaxComplete(true);
            return;
        }
        getAnimeDetails();
    }, [location.pathname]);

    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }],
    };

    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ bugReportState, setBugReportState }} />
            <Container fluid sx={{ margin: "10px 20px" }}>
                <AnimeDetailsOverviewComponent animeData={animeData} episodeInfoData={episodeInfoData} />
                <AnimeDetailsSubDubComponent animeData={animeData} />
                <AnimeDetailsEpisodeListComponent animeData={animeData} episodeInfoData={episodeInfoData} setEpisodeInfoData={setEpisodeInfoData} />
                <AnimeRelationComponent animeData={animeData} />
                {animeData.malId ? <AnimeRecommendationComponent malId={animeData.malId} /> : <></>}
                {animeData.malId ? <AnimeMalForumComponent malId={animeData.malId} /> : <></>}
            </Container>
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default AnimeDetailsScreen;
