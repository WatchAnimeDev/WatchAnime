import { Container, createStyles, Group, Loader, Pagination, Text } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBarComponent from "../components/SideBarComponent";
import { API_BASE_URL } from "../constants/genricConstants";
import AnimeSectionLayout from "../layouts/AnimeSectionLayout";
import { WATCHANIME_RED } from "../constants/cssConstants";

const useStyles = createStyles((theme) => ({
    bodyContainer: {
        margin: "20px 30px",
        paddingTop: "80px",
        [theme.fn.smallerThan("md")]: {
            margin: "20px 10px",
        },
    },
}));

const getApiUrlFromRoute = (location) => {
    if (location.pathname.includes("/recent")) {
        return `/recent/${location.pathname.split("/recent/")[1]}`;
    }
    if (location.pathname.includes("/popular")) {
        return `/popular/${location.pathname.split("/popular/")[1]}`;
    }
};

function GenericScreen({ sideBarState, setSideBarState, bugReportState, setBugReportState, pageType, hasPagination }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [genericPageData, setGenericPageData] = useState();
    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [activePage, setPage] = useState(location.pathname.split("/").slice(-1)[0]);

    const pageTitleType = {
        popular: "POPULAR",
        recent: "RECENTLY RELEASED",
    };

    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }],
    };

    const onPaginationClick = (e) => {
        let tempPath = location.pathname.split("/");
        tempPath.pop();
        navigate(`${tempPath.join("/")}/${e}`);
        setPage(e);
    };

    useEffect(() => {
        async function getGenericDetails() {
            setAjaxComplete(false);
            const [genericPageAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}${getApiUrlFromRoute(location)}`)]);
            setGenericPageData(genericPageAjaxData.data);
            setAjaxComplete(true);
            return;
        }
        getGenericDetails();
    }, [location]);

    const { classes } = useStyles();
    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ bugReportState, setBugReportState }} />
            <Container fluid className={classes.bodyContainer}>
                <Group sx={{ width: "100%", marginBottom: "30px" }}>
                    <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                        <Text sx={{ fontWeight: "700" }}>{pageTitleType[pageType]}</Text>
                    </Group>
                    <Group>
                        {genericPageData.map((genericData, ind) => (
                            <AnimeSectionLayout anime={genericData} key={ind} />
                        ))}
                    </Group>
                </Group>
                {hasPagination && (
                    <Group sx={{ marginTop: "50px", justifyContent: "center" }}>
                        {console.log(activePage)}
                        <Pagination
                            page={parseInt(activePage)}
                            onChange={onPaginationClick}
                            total={50}
                            styles={(theme) => ({
                                item: {
                                    "&[data-active]": {
                                        backgroundColor: WATCHANIME_RED,
                                    },
                                },
                            })}
                        />
                    </Group>
                )}
            </Container>
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default GenericScreen;
