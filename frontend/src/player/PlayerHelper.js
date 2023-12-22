import axios from "axios";

const getAnimeSkipData = async (animeData, episodeNumber, duration) => {
    try {
        if (!animeData.malId) {
            return [];
        }
        const skipTypeMap = { ed: "SKIP ENDING", op: "SKIP OPENING" };
        const skipData = (await axios.get(`https://api.aniskip.com/v2/skip-times/${animeData.malId}/${episodeNumber}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=${duration}`)).data.results;
        let formattedSkipData = [];
        for (const eachSkipData of skipData) {
            if (Object.keys(skipTypeMap).includes(eachSkipData.skipType))
                formattedSkipData.push({
                    type: eachSkipData.skipType,
                    displayString: skipTypeMap[eachSkipData.skipType],
                    startTime: eachSkipData.interval.startTime,
                    endTime: eachSkipData.interval.endTime,
                });
        }
        return formattedSkipData;
    } catch (e) {
        return [];
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

const setLastWatchedQueue = (slug, episodeNumber) => {
    let lastWatched = localStorage.getItem("lastWatchedQueue") || "[]";
    lastWatched = JSON.parse(lastWatched);
    lastWatched = lastWatched.filter((anime) => anime.slug !== slug);
    lastWatched.unshift({
        slug: slug,
        episodeNumber: parseFloat(episodeNumber),
        updatedAt: Date.now(),
    });
    if (lastWatched.length > 20) {
        lastWatched.pop();
    }
    localStorage.setItem("lastWatchedQueue", JSON.stringify(lastWatched));
};

const getLastWatchedData = (episode = false) => {
    let animeData = [];
    let lastWatchedQueue = localStorage.getItem("lastWatchedQueue") || "[]";
    lastWatchedQueue = JSON.parse(lastWatchedQueue);
    let watchHistory = localStorage.getItem("watchHistory") || "{}";
    watchHistory = JSON.parse(watchHistory);
    for (const lastWatched of lastWatchedQueue) {
        const playbackPercent = (watchHistory[lastWatched.slug].watchedEpisodes[lastWatched.episodeNumber].playBackTime / watchHistory[lastWatched.slug].watchedEpisodes[lastWatched.episodeNumber].duration) * 100;
        animeData.push({
            ...watchHistory[lastWatched.slug].animeData,
            ...{
                playbackPercent: playbackPercent,
                playBackData: !episode ? watchHistory[lastWatched.slug].watchedEpisodes[lastWatched.episodeNumber] : watchHistory[lastWatched.slug].watchedEpisodes[episode] ?? { playBackTime: 0 },
                currentReleasedEpisode: lastWatched.episodeNumber,
            },
        });
    }
    return animeData;
};

export { getAnimeSkipData, getWatchHistoryBySlug, getPlaybackTimeFromWatchHistoryBySlug, setWatchHistoryBySlug, setLastWatchedQueue, getLastWatchedData };
