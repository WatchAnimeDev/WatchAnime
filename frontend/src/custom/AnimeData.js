import axios from "axios";
import { API_BASE_URL } from "../constants/genricConstants";

function getImageByRelevance(images, size, type = "") {
    if (images.webp && (!type || type === "webp")) {
        return images.webp[size] ?? images.webp[Object.keys(images.webp)[0]];
    }
    if (images.jpg && (!type || type === "jpg")) {
        return images.jpg[size] ?? images.jpg[Object.keys(images.jpg)[0]];
    }
    if (images.png && (!type || type === "png")) {
        return images.png[size] ?? images.png[Object.keys(images.png)[0]];
    }
}

function getAnimeTitleByRelevance(titles, isDub = false, type = "Default") {
    let defaultTitle = titles.filter((eachTitle) => eachTitle.type === type);
    if (!defaultTitle.length && type !== "Default") {
        defaultTitle = titles.filter((eachTitle) => eachTitle.type === "Default");
    }
    return `${defaultTitle.length ? defaultTitle[0].title : titles[0].title}${isDub ? " (DUB)" : ""}`;
}

const toTitleCase = (phrase, delimiter = ",") => {
    return phrase
        .toLowerCase()
        .split(delimiter)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(delimiter);
};

const prepareVideoData = (videoData, userDefinedProxyUrl) => {
    var videos_with_video_format = [];
    for (const result of videoData) {
        if (result.url.includes("mp4") || result.url.includes("m3u8") || result.type.includes("mp4") || result.type.includes("hls") || result.type.includes("dash")) {
            videos_with_video_format.push({
                link: getVideoProxyUrl(result.url, userDefinedProxyUrl),
                type: result.url.includes("m3u8") ? "application/x-mpegURL" : "video/mp4",
                resolution: !result.url.includes("m3u8") && result.url.includes(".mp4") ? result?.res?.split(" ").join("") : "",
                priority: result.url.includes("m3u8") && result.url.includes("gogoplay") ? 1 : 0,
                subtitles: result.subtitles ? getSubtitlesProxyUrl(result.subtitles, userDefinedProxyUrl) : {},
            });
        }
    }
    videos_with_video_format.sort((b, a) => a.priority - b.priority);
    return videos_with_video_format;
};

const getVideoProxyUrl = (videoUrl, userDefinedProxyUrl = null) => {
    var whitelist = [
        "cache",
        "wix",
        "sharepoint",
        "pstatic.net",
        "workfields",
        "akamai-video-content",
        "wetransfer",
        "bilucdn",
        "cdnstream",
        "vipanicdn",
        "anifastcdn",
        "mirrorakam.akamaized",
        document.location.hostname,
        "watchanime.dev",
        "cdn-jupiter.com",
    ];
    // const whitelist = [];
    if (whitelist.some((link) => videoUrl.includes(link) || videoUrl.match(/[/]{2}[w]{3}[x][^.]*/gi)) || window.location.href.includes("debug")) {
        return videoUrl;
    }
    return `${API_BASE_URL}/proxy/m3u8/${encodeURIComponent(videoUrl.replace(/\/$|(\r\n|\n|\r)/gm, ""))}${userDefinedProxyUrl ? `?proxy=${userDefinedProxyUrl.replace(/\/$/, "")}` : ""}`;
};

const getSubtitlesProxyUrl = (subtitlesObj, userDefinedProxyUrl = null) => {
    subtitlesObj.url = `https://${userDefinedProxyUrl || "in-ani.watchanime.dev"}/${subtitlesObj.url}`;
    return subtitlesObj;
};

const prevEpisodeUrl = (animeSlug, episodeNumber) => {
    return episodeNumber > 1 ? `/anime/${animeSlug}/episode/${episodeNumber - 1}` : false;
};

const nextEpisodeUrl = (animeSlug, episodeNumber, totalEpisodes) => {
    return episodeNumber < totalEpisodes ? `/anime/${animeSlug}/episode/${episodeNumber + 1}` : false;
};

const getEpisodeCount = (animeData) => {
    return animeData.airing ? (animeData.releasedEpisodes ? animeData.releasedEpisodes : animeData.episodes) : animeData.episodes;
};

const malStatusToMediaStatus = (status) => {
    status = (status || "").toLowerCase();
    if (status === "currently airing") return "Ongoing";
    else if (status === "finished airing") return "Finished Airing";
    else if (status === "not yet aired") return "Not yet aired";
    return "Unknown";
};
/**
 * Returns a tmdb image based on type and relevance
 * @param {*} tmdbData Tmdb image result object
 * @param {*} type backdrops | logos | posters
 * @returns
 */
const getTmdbImageByRelevanceAndType = (tmdbData, type = "backdrops") => {
    return tmdbData && Object.keys(tmdbData).length ? (tmdbData[type].length ? `https://www.themoviedb.org/t/p/original${tmdbData[type][0].file_path}` : "") : "";
};

/**
 * Returns if anime object has tmdbData
 * @param {*} tmdbData
 * @returns
 */
const hasTmdbData = (animeData) => {
    return animeData.tmdbData && Object.keys(animeData.tmdbData).length;
};

const getLatestData = async (slugs, fullData = false) => {
    const data = await axios.post(`${API_BASE_URL}/anime/episode/latest`, {
        slugs: slugs,
        ...(fullData && { fulldata: 1 }),
    });
    return data;
};

export { getImageByRelevance, getAnimeTitleByRelevance, toTitleCase, prepareVideoData, prevEpisodeUrl, nextEpisodeUrl, getEpisodeCount, malStatusToMediaStatus, getTmdbImageByRelevanceAndType, hasTmdbData, getLatestData };
