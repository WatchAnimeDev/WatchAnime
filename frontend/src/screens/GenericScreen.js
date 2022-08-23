import { Container, createStyles, Group, Loader, Text } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../constants/genricConstants";
import AnimeSectionLayout from "../layouts/AnimeSectionLayout";

const useStyles = createStyles((theme) => ({
    bodyContainer: {
        margin: "20px 30px",
        paddingTop: "80px",
        [theme.fn.smallerThan("md")]: {
            margin: "20px 10px",
        },
    },
}));

const getApiUrlFromRoute = (location, searchParams) => {
    if (location.pathname.includes("/recent")) {
        return `/recent/${location.pathname.split("/recent/")[1]}`;
    }
    if (location.pathname.includes("/popular")) {
        return `/popular/${location.pathname.split("/popular/")[1]}`;
    }
};

function GenericScreen({ pageType }) {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [genericPageData, setGenericPageData] = useState();
    const [ajaxComplete, setAjaxComplete] = useState(false);

    useEffect(() => {
        async function getGenericDetails() {
            setAjaxComplete(false);
            const [genericPageAjaxData] = await Promise.all([axios.get(`${API_BASE_URL}${getApiUrlFromRoute(location, searchParams)}`)]);
            setGenericPageData(genericPageAjaxData.data);
            setAjaxComplete(true);
            return;
        }
        getGenericDetails();
    }, [location, searchParams]);

    const { classes } = useStyles();
    return ajaxComplete ? (
        <Container fluid className={classes.bodyContainer}>
            <Group sx={{ width: "100%", marginBottom: "30px" }}>
                <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                    <Text sx={{ fontWeight: "700" }}>{"RECENTLY RELEASED"}</Text>
                </Group>
                <Group>
                    {genericPageData.map((genericData, ind) => (
                        <AnimeSectionLayout anime={genericData} key={ind} />
                    ))}
                </Group>
            </Group>
        </Container>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default GenericScreen;
