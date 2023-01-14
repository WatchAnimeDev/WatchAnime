import { getAnimeTitleByRelevance } from "./AnimeData";
import { showGenericCheckBoxNotification } from "./Notification";
import { subscribeToEpisodeNotification, unSubscribeToEpisodeNotification } from "./Notifications";

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
const handleWatchListAdd = async (e, selectedAnimeData, setWatchListDataState) => {
    if (e) e.preventDefault();
    await subscribeToEpisodeNotification(selectedAnimeData.slug);
    setWatchListData(selectedAnimeData);
    showGenericCheckBoxNotification("Added to watchlist!", `${getAnimeTitleByRelevance(selectedAnimeData.titles)} has been added to watchlist!`);
    if (setWatchListDataState) setWatchListDataState(getWatchListDataBySlug(selectedAnimeData.slug));
};
const handleWatchListDelete = async (e, selectedAnimeData, setWatchListData) => {
    if (e) e.preventDefault();
    await unSubscribeToEpisodeNotification(selectedAnimeData.slug);
    deleteFromWatchListBySlug(selectedAnimeData.slug);
    showGenericCheckBoxNotification("Removed from watchlist!", `${getAnimeTitleByRelevance(selectedAnimeData.titles)} has been removed to watchlist!`, { color: "red" });
    if (setWatchListData) setWatchListData({});
};

export { getWatchListAllData, setWatchListData, getWatchListDataBySlug, deleteFromWatchListBySlug, handleWatchListAdd, handleWatchListDelete };
