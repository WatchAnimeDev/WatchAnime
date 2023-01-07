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

export { getUserNotifications, getNotificationTitleFromNotificationData, getNotificationPreviewImageFromNotificationData };
