import { create } from "zustand";
import { subscribeToEpisodeNotification, unSubscribeToEpisodeNotification } from "../custom/Notifications";
import { showGenericCheckBoxNotification } from "../custom/Notification";
import { getAnimeTitleByRelevance } from "../custom/AnimeData";
import { getUidForLoggedInUser } from "../custom/Auth";
import { fetchWatchListData } from "../custom/WatchList";

const useWatchListStore = create((set, get) => ({
    watchListData: [],
    watchListDataPaginated: {
        fetchedWatchListData: [],
        fetchedWatchListDataPageInfo: {},
    },

    setWatchListData: (animeData) => {
        set((state) => {
            let watchListData = state.watchListData;
            if (animeData.currentReleasedEpisode) {
                delete animeData.currentReleasedEpisode;
            }
            if (animeData.playbackPercent) {
                delete animeData.playbackPercent;
            }
            watchListData = watchListData.filter((anime) => anime.slug !== animeData.slug);
            watchListData.push(animeData);
            return { watchListData };
        });
    },

    deleteFromWatchListBySlug: (slug) => {
        set((state) => {
            let watchListData = state.watchListData;
            watchListData = watchListData.filter((anime) => anime.slug !== slug);
            return { watchListData };
        });
    },

    fetchWatchListData: async () => {
        const { fetchedWatchListData } = await fetchWatchListData(getUidForLoggedInUser());
        set({ watchListData: fetchedWatchListData });
    },

    fetchWatchListDataPaginated: async (page = 1, pageSize = 20, watchlistType = 0) => {
        const { fetchedWatchListData, fetchedWatchListDataPageInfo } = await fetchWatchListData(getUidForLoggedInUser(), page, pageSize, watchlistType);

        set(() => ({
            watchListDataPaginated: { fetchedWatchListData, fetchedWatchListDataPageInfo },
        }));
        return { fetchedWatchListData, fetchedWatchListDataPageInfo };
    },

    handleWatchListAdd: async (selectedAnimeData) => {
        await subscribeToEpisodeNotification(selectedAnimeData.slug);
        get().setWatchListData(selectedAnimeData);
        showGenericCheckBoxNotification("Added to watchlist!", `${getAnimeTitleByRelevance(selectedAnimeData.titles)} has been added to watchlist!`);
    },

    handleWatchListDelete: async (selectedAnimeData) => {
        await unSubscribeToEpisodeNotification(selectedAnimeData.slug);
        get().deleteFromWatchListBySlug(selectedAnimeData.slug);
        showGenericCheckBoxNotification("Removed from watchlist!", `${getAnimeTitleByRelevance(selectedAnimeData.titles)} has been removed to watchlist!`);
    },
}));

export { useWatchListStore };
