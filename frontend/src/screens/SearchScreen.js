import { Anchor, Group, Image, Input, Loader, Modal, Text } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { SearchQueryObject } from "../graphql/graphqlQueries";
import { getAnimeTitleByRelevance, getImageByRelevance } from "../custom/AnimeData";
import { Link, useNavigate } from "react-router-dom";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { useShallow } from "zustand/react/shallow";
import { useLanguageStore } from "../store/LanguageToggleStore";

function SearchScreen({ searchModalOpen, setSearchModalOpen }) {
    const [searchString, setSearchString] = useDebouncedState("", 200);
    const [searchedAnimeData, setSearchedAnimeData] = useState({});
    const [loading, setLoading] = useState(false);
    const { language } = useLanguageStore(useShallow((state) => ({ language: state.language })));
    const navigate = useNavigate();

    useEffect(() => {
        if (searchString.length < 3) {
            setSearchedAnimeData([]);
            return;
        }
        async function performSearch() {
            setLoading(true);
            const animeData = await execGraphqlQuery(SearchQueryObject, { name: searchString });
            let searchActionDataSub = [];
            let searchActionDataDub = [];

            for (const anime of animeData.data.data.Page.media) {
                const isDub = anime.slug.includes("dub");
                const searchActionData = {
                    image: getImageByRelevance(anime.images, "image_url"),
                    title: getAnimeTitleByRelevance(anime.titles, isDub, language),
                    description: anime.synopsis,
                    slug: anime.slug,
                    onTrigger: (e) => {
                        setSearchModalOpen(false);
                        navigate(`/anime/${anime.slug}`);
                    },
                    group: isDub ? "DUB" : "SUB",
                };
                if (isDub) {
                    searchActionDataDub.push(searchActionData);
                } else {
                    searchActionDataSub.push(searchActionData);
                }
            }
            setLoading(false);
            setSearchedAnimeData({ ...(searchActionDataDub.length ? { dub: searchActionDataDub.slice(0, 3) } : {}), ...(searchActionDataSub.length ? { sub: searchActionDataSub.slice(0, 3) } : {}) });
        }
        performSearch();
        // eslint-disable-next-line
    }, [searchString, language]);

    return (
        <Modal opened={searchModalOpen} withCloseButton={false} className={"mantine-search-modal"} transitionDuration={150} overlayBlur={3} onClose={() => setSearchModalOpen(false)}>
            <Input icon={<IconSearch className={"mantine-search-icon"} />} placeholder="Search" height={50} onChange={(e) => setSearchString(e.target.value)} rightSection={<Group>{loading ? <Loader size={30} /> : <></>}</Group>} />
            {Object.keys(searchedAnimeData).length ? (
                <Group p={5} sx={{ borderTop: "1px solid #373A40", gap: 0 }}>
                    {Object.keys(searchedAnimeData).map((key) => (
                        <div key={key}>
                            <Text size={10} pb={0} pt={15} px={15} w={"100%"} weight={700} color="#909296">
                                {key.toUpperCase()}
                            </Text>
                            {searchedAnimeData[key].map((anime) => (
                                <Group
                                    py={10}
                                    px={15}
                                    sx={{ ":hover": { backgroundColor: "#373A40" }, borderRadius: "4px", cursor: "pointer" }}
                                    key={anime.slug}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        anime.onTrigger();
                                    }}
                                >
                                    <Group noWrap={true}>
                                        <Image src={anime.image} width={50} height={50} />
                                        <Group sx={{ flexDirection: "column", gap: 0, alignItems: "flex-start" }}>
                                            <Text>{anime.title}</Text>
                                            <Text size={12} lineClamp={1} color="#909296">
                                                {anime.description}
                                            </Text>
                                        </Group>
                                    </Group>
                                </Group>
                            ))}
                        </div>
                    ))}
                </Group>
            ) : (
                <></>
            )}

            <Group py={10} px={15} sx={{ borderTop: "1px solid #373A40", justifyContent: "space-between" }}>
                <Group sx={{ gap: "3px" }}>
                    <Text color="#909296" size={12}>
                        Search powered by{" "}
                    </Text>
                    <Text size={12}>Watchanime</Text>
                </Group>
                {Object.keys(searchedAnimeData).length ? (
                    <Anchor size="xs" href="#" component={Link} to={`/catalog?name=${searchString}`} onClick={(e) => setSearchModalOpen(false)}>
                        View more
                    </Anchor>
                ) : (
                    <></>
                )}
            </Group>
        </Modal>
    );
}

export default SearchScreen;
