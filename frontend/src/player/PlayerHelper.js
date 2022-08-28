const initHlsSelector = (player) => {
    if (typeof player.hlsQualitySelector === "function") {
        player.hlsQualitySelector({
            displayCurrentQuality: true,
        });
    }
};

const getWatchHistoryBySlug = (slug) => {
    let playBackHistory = localStorage.getItem("watchHistory") || "{}";
    playBackHistory = JSON.parse(playBackHistory);
    return playBackHistory[slug] ?? {};
};

const getPlaybackTimeFromWatchHistoryBySlug = (slug, episodeNumber) => {
    const playBackHistory = getWatchHistoryBySlug(slug);
    if (Object.keys(playBackHistory).length && playBackHistory.watchedEpisodes) {
        if (playBackHistory.watchedEpisodes[episodeNumber]) {
            return playBackHistory.watchedEpisodes[episodeNumber];
        }
    }
    return {};
};

const formatWatchHistoryData = (prevData, animeData, playBackData, episodeNumber) => {
    let watchedEpisodes = {};
    let slug = animeData.slug;
    if (prevData[slug]) {
        prevData[slug].watchedEpisodes[episodeNumber] = playBackData;
    } else {
        watchedEpisodes[episodeNumber] = playBackData;
        prevData[slug] = {
            animeData: animeData,
            watchedEpisodes: watchedEpisodes,
        };
    }
    return prevData;
};
const setWatchHistoryBySlug = (animeData, playbackDetails, episodeNumber) => {
    let lastWatched = localStorage.getItem("watchHistory") || "{}";
    lastWatched = JSON.parse(lastWatched);
    lastWatched = formatWatchHistoryData(lastWatched, animeData, playbackDetails, episodeNumber);
    localStorage.setItem("watchHistory", JSON.stringify(lastWatched));
};

export { initHlsSelector, getWatchHistoryBySlug, getPlaybackTimeFromWatchHistoryBySlug, setWatchHistoryBySlug };
