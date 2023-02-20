import { API_REDIRECT_HOST } from "../constants/genricConstants";

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

function getAnimeTitleByRelevance(titles, isDub) {
    const defaultTitle = titles.filter((eachTitle) => eachTitle.type === "Default");
    return `${defaultTitle.length ? defaultTitle[0].title : titles[0].title}${isDub ? " (DUB)" : ""}`;
}

const toTitleCase = (phrase, delimiter = ",") => {
    return phrase
        .toLowerCase()
        .split(delimiter)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(delimiter);
};

const prepareVideoData = (videoData) => {
    var videos_with_video_format = [];
    for (const result of videoData) {
        if (result.url.includes("mp4") || result.url.includes("m3u8") || result.type.includes("mp4")) {
            videos_with_video_format.push({
                link: getProxyUrl(result.url),
                type: result.url.includes("m3u8") ? "application/x-mpegURL" : "video/mp4",
                resolution: !result.url.includes("m3u8") && result.url.includes(".mp4") ? result?.res?.split(" ").join("") : "",
                priority: result.url.includes("m3u8") && result.url.includes("gogoplay") ? 1 : 0,
            });
        }
    }
    videos_with_video_format.sort((b, a) => a.priority - b.priority);
    return videos_with_video_format;
};

const getProxyUrl = (videoUrl) => {
    var whitelist = ["vrv", "pl.", "midorii", "loadfast", "peliscdn", "cache", "wix", "sharepoint", "pstatic.net", "gofcdn", "workfields", "asuncdn", document.location.hostname];
    if (whitelist.some((link) => videoUrl.includes(link) || videoUrl.match(/[/]{2}[w]{3}[x][^.]*/gi))) {
        return videoUrl;
    }
    return API_REDIRECT_HOST + videoUrl;
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

export { getImageByRelevance, getAnimeTitleByRelevance, toTitleCase, prepareVideoData, prevEpisodeUrl, nextEpisodeUrl, getEpisodeCount, malStatusToMediaStatus };
