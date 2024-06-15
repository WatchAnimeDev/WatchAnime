import axios from "axios";
import { NOTIFICATION_BASE_URL, STATIC_BUCKET_URL } from "../constants/genricConstants";
import { getAnimeTitleByRelevance, getImageByRelevance } from "./AnimeData";
import { getUidForLoggedInUser } from "./Auth";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { NotificationQueryObject } from "../graphql/graphqlQueries";

const getUserNotifications = async (queryObj = {}, includePageInfo = false) => {
    const fetchedNotificationData = await execGraphqlQuery(NotificationQueryObject, {
        userId: getUidForLoggedInUser(),
        page: queryObj.page || 1,
        pageSize: queryObj.pageSize || 5,
        includeDissmissed: queryObj.includeDissmissed || false,
        excludeAnnouncements: queryObj.excludeAnnouncements || false,
    });

    return includePageInfo ? { fetchedNotificationData: fetchedNotificationData.data.data.Page.notifications, fetchedNotificationDataPageInfo: fetchedNotificationData.data.data.Page.pageInfo } : fetchedNotificationData.data.data.Page.notifications;
};

const getNotificationPreviewImageFromNotificationData = (notificationData) => {
    switch (notificationData.notif_type) {
        case 1:
            return getImageByRelevance(notificationData.media.images);
        default:
            return `${STATIC_BUCKET_URL}/android_chrome_512x512_VzVtfe3JYt.png`;
    }
};
const subscribeToEpisodeNotification = async (slug) => {
    try {
        await axios.post(`${NOTIFICATION_BASE_URL}/notifications/subscribe`, {
            slug: slug,
            userId: getUidForLoggedInUser(),
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
            userId: getUidForLoggedInUser(),
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
const dismissNotification = async (notificatonId) => {
    try {
        await axios.post(`${NOTIFICATION_BASE_URL}/notifications/dismiss`, {
            notificatonId: notificatonId,
            userId: getUidForLoggedInUser(),
        });
        return true;
    } catch (e) {
        return false;
    }
};

const getNotificationTitleFromNotificationData = (notificationData, language = "Default") => {
    switch (notificationData.notif_type) {
        case 0:
            return notificationData.title;
        case 1:
            return `Episode ${notificationData.episode_number} of ${getAnimeTitleByRelevance(notificationData.media.titles, notificationData.slug_id.includes("dub"), language)} is out now.`;
        default:
            return "Well this isnt expected";
    }
};

export {
    getUserNotifications,
    getNotificationPreviewImageFromNotificationData,
    subscribeToEpisodeNotification,
    unSubscribeToEpisodeNotification,
    handleNotificationClick,
    generateNotificationCss,
    dismissNotification,
    getNotificationTitleFromNotificationData,
};
