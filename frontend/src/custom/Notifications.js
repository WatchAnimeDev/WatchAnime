import axios from "axios";
import { NOTIFICATION_BASE_URL, STATIC_BUCKET_URL } from "../constants/genricConstants";
import { getAnimeTitleByRelevance, getImageByRelevance } from "./AnimeData";
import { getOrSetUid } from "./User";

const getUserNotifications = async () => {
    return (await axios.get(`${NOTIFICATION_BASE_URL}/notifications/get/${getOrSetUid()}`)).data;
};
const getNotificationTitleFromNotificationData = (notificationData) => {
    switch (notificationData.notif_type) {
        case 0:
            return notificationData.title;
        case 1:
            return `Episode ${notificationData.episode_number} of ${getAnimeTitleByRelevance(notificationData.animeTitle, notificationData.slug_id.includes("dub"))} is out now.`;
        default:
            return "Well this isnt expected";
    }
};
const getNotificationPreviewImageFromNotificationData = (notificationData) => {
    switch (notificationData.notif_type) {
        case 1:
            return getImageByRelevance(notificationData.previewImage);
        default:
            return `${STATIC_BUCKET_URL}/watchanime-512x512.png`;
    }
};
const subscribeToEpisodeNotification = async (slug) => {
    try {
        await axios.post(`${NOTIFICATION_BASE_URL}/notifications/subscribe`, {
            slug: slug,
            userId: getOrSetUid(),
        });
        return true;
    } catch (e) {
        return false;
    }
};
const unSubscribeToEpisodeNotification = async (slug) => {
    try {
        await axios.post(`${NOTIFICATION_BASE_URL}/notifications/unsubscribe`, {
            slug: slug,
            userId: getOrSetUid(),
        });
        return true;
    } catch (e) {
        return false;
    }
};

const handleNotificationClick = (notificationData, navigate) => {
    switch (notificationData.notif_type) {
        case 1:
            navigate(`/anime/${notificationData.slug_id}/episode/${notificationData.episode_number}`);
            break;

        default:
            break;
    }
};

const generateNotificationCss = (notificationData) => {
    switch (notificationData.notif_type) {
        case 1:
            return { cursor: "pointer" };

        default:
            break;
    }
};

export { getUserNotifications, getNotificationTitleFromNotificationData, getNotificationPreviewImageFromNotificationData, subscribeToEpisodeNotification, unSubscribeToEpisodeNotification, handleNotificationClick, generateNotificationCss };
