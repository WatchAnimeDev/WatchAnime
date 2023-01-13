import { getAnimeTitleByRelevance } from "./AnimeData";
import { showGenericCheckBoxNotification } from "./Notification";

const getWatchListAllData = () => {
    return JSON.parse(localStorage.getItem("watchListQueue") || "[]");
};
const setWatchListData = (animeData) => {
    let watchListData = JSON.parse(localStorage.getItem("watchListQueue") || "[]");
    if (animeData.currentReleasedEpisode) {
        delete animeData.currentReleasedEpisode;
    }
    if (animeData.playbackPercent) {
        delete animeData.playbackPercent;
    }
    watchListData = watchListData.filter((anime) => anime.slug !== animeData.slug);
    watchListData.push(animeData);
    localStorage.setItem("watchListQueue", JSON.stringify(watchListData));
};
const getWatchListDataBySlug = (slug) => {
    let watchListData = JSON.parse(localStorage.getItem("watchListQueue") || "[]");
    watchListData = watchListData.filter((anime) => anime.slug === slug);
    return watchListData.length ? watchListData[0] : {};
};
const deleteFromWatchListBySlug = (slug) => {
    let watchListData = JSON.parse(localStorage.getItem("watchListQueue") || "[]");
    watchListData = watchListData.filter((anime) => anime.slug !== slug);
    localStorage.setItem("watchListQueue", JSON.stringify(watchListData));
};
const handleWatchListAdd = (e, selectedAnimeData, setWatchListDataState) => {
    e.preventDefault();
    setWatchListData(selectedAnimeData);
    showGenericCheckBoxNotification("Added to watchlist!", `${getAnimeTitleByRelevance(selectedAnimeData.titles)} has been added to watchlist!`);
    setWatchListDataState(getWatchListDataBySlug(selectedAnimeData.slug));
};
const handleWatchListDeleteFromAnimeDetails = (e, selectedAnimeData, setWatchListData) => {
    e.preventDefault();
    deleteFromWatchListBySlug(selectedAnimeData.slug);
    showGenericCheckBoxNotification("Removed from watchlist!", `${getAnimeTitleByRelevance(selectedAnimeData.titles)} has been removed to watchlist!`, { color: "red" });
    setWatchListData({});
};
export { getWatchListAllData, setWatchListData, getWatchListDataBySlug, deleteFromWatchListBySlug, handleWatchListAdd, handleWatchListDeleteFromAnimeDetails };
