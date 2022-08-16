import axios from "axios";
import { API_BASE_URL } from "../constants/genricConstants";
import { getAnimeTitleByRelevance, getImageByRelevance } from "./AnimeData";

export function handleSpotLightSearch(e, setSearchData) {
    if (e.target.value.length < 3) {
        return;
    }
    let searchActionData = [];
    axios.get(`${API_BASE_URL}/search/${e.target.value}`).then((animeData) => {
        for (const anime of animeData.data) {
            searchActionData.push({
                image: getImageByRelevance(anime.images, "image_url"),
                title: getAnimeTitleByRelevance(anime.titles, anime.slug.includes("dub")),
                description: anime.synopsis,
                onTrigger: (e) => {
                    window.location.href = `/anime/${anime.slug}`;
                },
                group: anime.slug.includes("dub") ? "DUB" : "SUB",
            });
        }
        setSearchData(searchActionData);
    });
}
