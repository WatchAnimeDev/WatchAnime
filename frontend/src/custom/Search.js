import { getAnimeTitleByRelevance, getImageByRelevance } from "./AnimeData";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { SearchQueryObject } from "../graphql/graphqlQueries";

export async function handleSpotLightSearch(e, setSearchData, navigate) {
    if (e.target.value.length < 3) {
        return;
    }
    let searchActionData = [];
    const animeData = await execGraphqlQuery(SearchQueryObject, { name: e.target.value });
    for (const anime of animeData.data.data.Page.media) {
        searchActionData.push({
            image: getImageByRelevance(anime.images, "image_url"),
            title: getAnimeTitleByRelevance(anime.titles, anime.slug.includes("dub")),
            description: anime.synopsis,
            onTrigger: (e) => {
                navigate(`/anime/${anime.slug}`);
            },
            group: anime.slug.includes("dub") ? "DUB" : "SUB",
        });
    }
    setSearchData(searchActionData);
}
