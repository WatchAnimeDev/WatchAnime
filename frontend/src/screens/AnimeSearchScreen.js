import React, { useEffect, useState } from "react";
import SideBarComponent from "../components/SideBarComponent";
import { Box, Button, Container, Flex, Group, Input, Loader, MultiSelect, Pagination, RangeSlider, Select, Text, createStyles, useMantineTheme } from "@mantine/core";
import AnimeSectionLayout from "../layouts/AnimeSectionLayout";
import { useSearchParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { IconSortDescending } from "@tabler/icons";
import { CatalogQueryObj } from "../graphql/graphqlQueries";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
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

function AnimeSearchScreen({ sideBarState, setSideBarState, bugReportState, setBugReportState }) {
    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }],
    };

    const { classes } = useStyles();
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();
    const [activePage, setActivePage] = useState(1);

    const [searchPageData, setSearchPageData] = useState([]);
    const [serchPagePaginationData, setSerchPagePaginationData] = useState({});
    const [ajaxComplete, setAjaxComplete] = useState(false);

    const [nameValue, setNameValue] = useState(searchParams.get("name") || "");
    const [sortValue, setSortValue] = useState("score dsc");
    const [animeTypeValue, setAnimeTypeValue] = useState("ALL");
    const [sourceValue, setSourceValue] = useState("ALL");
    const [statusValue, setStatusValue] = useState("ALL");
    const [ratingValue, setRatingValue] = useState("ALL");
    const [seasonValue, setSeasonValue] = useState("ALL");
    const [scoreValue, setScoreValue] = useState([0, 100]);
    const [genreValue, setGenreValue] = useState(searchParams.get("genre") ? searchParams.get("genre").split("|") : ["ALL"]);

    async function getSearchDetails() {
        setAjaxComplete(false);
        const sortValueString = sortValue.split(" ");
        const genreValueString = genreValue.includes("ALL") ? "ALL" : genreValue.join("|");
        const [searchPageAjaxData] = await Promise.all([
            execGraphqlQuery(CatalogQueryObj, {
                page: activePage,
                pageSize: 25,
                name: nameValue,
                type: animeTypeValue,
                source: sourceValue,
                status: statusValue,
                rating: ratingValue,
                season: seasonValue,
                scoremin: scoreValue[0] / 10,
                scoremax: scoreValue[0] / 10,
                genres: genreValueString,
                notdub: true,
                sortby: sortValueString[0],
                sortorder: sortValueString[1],
            }),
        ]);
        setSearchPageData(searchPageAjaxData.data.data.Page.media);
        setSerchPagePaginationData(searchPageAjaxData.data.data.Page.pageInfo);
        setAjaxComplete(true);
        return;
    }

    useEffect(() => {
        getSearchDetails();
        // eslint-disable-next-line
    }, [activePage]);

    return ajaxComplete ? (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ bugReportState, setBugReportState }} />
            <Container fluid className={classes.bodyContainer}>
                <Flex justify={"space-between"} align={"center"}>
                    <Text sx={{ fontSize: "24px", fontWeight: 700 }}>Catalog</Text>
                    <Flex align={"center"} gap={"md"}>
                        <Flex align={"center"}>
                            <IconSortDescending size={18} />
                            <Text sx={{ fontSize: "15px" }}>Sort By</Text>
                        </Flex>
                        <Select
                            placeholder="Score desc"
                            value={sortValue}
                            onChange={setSortValue}
                            data={[
                                { value: "score asc", label: "Score asc" },
                                { value: "score desc", label: "Score desc" },

                                { value: "slug asc", label: "Title asc" },
                                { value: "slug desc", label: "Title desc" },

                                { value: "year asc", label: "Year asc" },
                                { value: "year desc", label: "Year desc" },
                            ]}
                        />
                    </Flex>
                </Flex>
                <Flex mt={"lg"} direction={mobile ? "column" : "row"}>
                    <Flex direction={"column"} gap={"1rem"}>
                        <Input placeholder="Search" sx={{ borderRadius: "8px", border: "1px solid #25262b" }} value={nameValue} onChange={(event) => setNameValue(event.currentTarget.value)} />
                        <Flex direction={"column"} sx={{ width: "300px", backgroundColor: "rgb(37, 38, 43)", borderRadius: "8px" }} p={"lg"} m={mobile ? "auto" : "0px"}>
                            <Select
                                label="Anime Type"
                                placeholder="All"
                                data={[
                                    { value: "ALL", label: "ALL" },
                                    { value: "Movie", label: "Movie" },
                                    { value: "Music", label: "Music" },
                                    { value: "ONA", label: "ONA" },
                                    { value: "OVA", label: "OVA" },
                                    { value: "Special", label: "Special" },
                                    { value: "TV", label: "TV" },
                                ]}
                                value={animeTypeValue}
                                onChange={setAnimeTypeValue}
                            />
                            <Select
                                label="Sources"
                                placeholder="All"
                                data={[
                                    { value: "ALL", label: "ALL" },
                                    { value: "4-koma manga", label: "4-koma manga" },
                                    { value: "Book", label: "Book" },
                                    { value: "Card game", label: "Card game" },
                                    { value: "Game", label: "Game" },
                                    { value: "Light novel", label: "Light novel" },
                                    { value: "Manga", label: "Manga" },
                                    { value: "Mixed media", label: "Mixed media" },
                                    { value: "Music", label: "Music" },
                                    { value: "Novel", label: "Novel" },
                                    { value: "Original", label: "Original" },
                                    { value: "Other", label: "Other" },
                                    { value: "Picture book", label: "Picture book" },
                                    { value: "Radio", label: "Radio" },
                                    { value: "Unknown", label: "Unknown" },
                                    { value: "Visual novel", label: "Visual novel" },
                                    { value: "Web manga", label: "Web manga" },
                                    { value: "Web novel", label: "Web novel" },
                                ]}
                                mt={"md"}
                                value={sourceValue}
                                onChange={setSourceValue}
                            />
                            <Select
                                label="Airing Status"
                                placeholder="All"
                                data={[
                                    { value: "ALL", label: "ALL" },
                                    { value: "Currently Airing", label: "Currently Airing" },
                                    { value: "Finished Airing", label: "Finished Airing" },
                                    { value: "Not yet aired", label: "Not yet aired" },
                                ]}
                                mt={"md"}
                                value={statusValue}
                                onChange={setStatusValue}
                            />
                            <Select
                                label="Content Rating"
                                placeholder="All"
                                data={[
                                    { value: "ALL", label: "ALL" },
                                    { value: "G - All Ages", label: "G - All Ages" },
                                    { value: "PG - Children", label: "PG - Children" },
                                    { value: "PG-13 - Teens 13 or older", label: "PG-13 - Teens 13 or older" },
                                    { value: "R - 17+ (violence & profanity)", label: "R - 17+ (violence & profanity)" },
                                    { value: "R+ - Mild Nudity", label: "R+ - Mild Nudity" },
                                    { value: "Rx - Hentai", label: "Rx - Hentai" },
                                ]}
                                mt={"md"}
                                value={ratingValue}
                                onChange={setRatingValue}
                            />
                            <Select
                                label="Season"
                                placeholder="All"
                                data={[
                                    { value: "ALL", label: "ALL" },
                                    { value: "fall", label: "Fall" },
                                    { value: "spring", label: "Spring" },
                                    { value: "summer", label: "Summer" },
                                    { value: "winter", label: "Winter" },
                                ]}
                                value={seasonValue}
                                onChange={setSeasonValue}
                                mt={"md"}
                            />
                            <Box mt={"md"}>
                                <Text>Score</Text>
                                <RangeSlider value={scoreValue} onChange={setScoreValue} step={1} mt={"xs"} label={(value) => `${value} %`} />
                            </Box>
                            <MultiSelect
                                data={[
                                    { value: "ALL", label: "ALL" },
                                    { value: "Slice of Life", label: "Slice of Life" },
                                    { value: "Adventure", label: "Adventure" },
                                    { value: "Girls Love", label: "Girls Love" },
                                    { value: "action", label: "action" },
                                    { value: "comedy", label: "comedy" },
                                    { value: "game", label: "game" },
                                    { value: "workplace", label: "workplace" },
                                    { value: "gender-bender", label: "gender-bender" },
                                    { value: "kids", label: "kids" },
                                    { value: "Horror", label: "Horror" },
                                    { value: "family", label: "family" },
                                    { value: "team-sports", label: "team-sports" },
                                    { value: "historical", label: "historical" },
                                    { value: "high-stakes-game", label: "high-stakes-game" },
                                    { value: "Avant Garde", label: "Avant Garde" },
                                    { value: "Ecchi", label: "Ecchi" },
                                    { value: "Erotica", label: "Erotica" },
                                    { value: "mecha", label: "mecha" },
                                    { value: "thriller", label: "thriller" },
                                    { value: "music", label: "music" },
                                    { value: "iyashikei", label: "iyashikei" },
                                    { value: "strategy-game", label: "strategy-game" },
                                    { value: "sci-fi", label: "sci-fi" },
                                    { value: "Comedy", label: "Comedy" },
                                    { value: "demons", label: "demons" },
                                    { value: "romance", label: "romance" },
                                    { value: "organized-crime", label: "organized-crime" },
                                    { value: "parody", label: "parody" },
                                    { value: "cars", label: "cars" },
                                    { value: "Drama", label: "Drama" },
                                    { value: "Romance", label: "Romance" },
                                    { value: "romantic-subtext", label: "romantic-subtext" },
                                    { value: "harem", label: "harem" },
                                    { value: "seinen", label: "seinen" },
                                    { value: "Sports", label: "Sports" },
                                    { value: "vampire", label: "vampire" },
                                    { value: "Supernatural", label: "Supernatural" },
                                    { value: "mythology", label: "mythology" },
                                    { value: "Boys Love", label: "Boys Love" },
                                    { value: "drama", label: "drama" },
                                    { value: "slice-of-life", label: "slice-of-life" },
                                    { value: "mystery", label: "mystery" },
                                    { value: "school", label: "school" },
                                    { value: "ecchi", label: "ecchi" },
                                    { value: "Mystery", label: "Mystery" },
                                    { value: "supernatural", label: "supernatural" },
                                    { value: "adult-cast", label: "adult-cast" },
                                    { value: "fantasy", label: "fantasy" },
                                    { value: "martial-arts", label: "martial-arts" },
                                    { value: "space", label: "space" },
                                    { value: "crime", label: "crime" },
                                    { value: "pets", label: "pets" },
                                    { value: "shounen-ai", label: "shounen-ai" },
                                    { value: "Award Winning", label: "Award Winning" },
                                    { value: "detective", label: "detective" },
                                    { value: "super-power", label: "super-power" },
                                    { value: "Action", label: "Action" },
                                    { value: "dub", label: "dub" },
                                    { value: "magical-sex-shift", label: "magical-sex-shift" },
                                    { value: "comic", label: "comic" },
                                    { value: "Fantasy", label: "Fantasy" },
                                    { value: "adventure", label: "adventure" },
                                    { value: "Gourmet", label: "Gourmet" },
                                    { value: "delinquents", label: "delinquents" },
                                    { value: "time-travel", label: "time-travel" },
                                    { value: "performing-arts", label: "performing-arts" },
                                    { value: "horror", label: "horror" },
                                    { value: "military", label: "military" },
                                    { value: "visual-arts", label: "visual-arts" },
                                    { value: "shounen", label: "shounen" },
                                    { value: "mahou-shoujo", label: "mahou-shoujo" },
                                    { value: "magic", label: "magic" },
                                    { value: "anthropomorphic", label: "anthropomorphic" },
                                    { value: "samurai", label: "samurai" },
                                    { value: "sports", label: "sports" },
                                    { value: "shoujo", label: "shoujo" },
                                    { value: "Sci-Fi", label: "Sci-Fi" },
                                    { value: "psychological", label: "psychological" },
                                    { value: "cgdct", label: "cgdct" },
                                    { value: "Suspense", label: "Suspense" },
                                    { value: "gag-humor", label: "gag-humor" },
                                    { value: "police", label: "police" },
                                    { value: "isekai", label: "isekai" },
                                    { value: "suspense", label: "suspense" },
                                    { value: "Hentai", label: "Hentai" },
                                ]}
                                label="Genres"
                                placeholder="Pick all that you like"
                                mt={"md"}
                                value={genreValue}
                                onChange={setGenreValue}
                                searchable
                                nothingFound="Nothing found"
                            />
                        </Flex>
                        <Button sx={{ backgroundColor: "rgb(37, 38, 43)" }} onClick={getSearchDetails} mb={"md"}>
                            Filter
                        </Button>
                    </Flex>

                    <Box sx={{ width: mobile ? "100%" : "calc(100% - 300px)", borderRadius: "8px" }} pl={"lg"}>
                        <Group>
                            {searchPageData.map((genericData, ind) => (
                                <AnimeSectionLayout anime={genericData} key={ind} />
                            ))}
                        </Group>
                    </Box>
                </Flex>
                <Group sx={{ marginTop: "50px", justifyContent: "center" }}>
                    <Pagination
                        page={serchPagePaginationData.currentPage}
                        onChange={setActivePage}
                        total={serchPagePaginationData.lastPage}
                        styles={(theme) => ({
                            item: {
                                "&[data-active]": {
                                    backgroundColor: WATCHANIME_RED,
                                },
                            },
                        })}
                    />
                </Group>
            </Container>
        </>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default AnimeSearchScreen;
