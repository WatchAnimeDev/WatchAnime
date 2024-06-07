import axios from "axios";
import { NOTIFICATION_BASE_URL, STATIC_BUCKET_URL } from "../constants/genricConstants";
import { getImageByRelevance } from "./AnimeData";
import { getUidForLoggedInUser } from "./Auth";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { NotificationQueryObject } from "../graphql/graphqlQueries";

const getUserNotifications = async (queryObj = {}) => {
    return (
        await execGraphqlQuery(NotificationQueryObject, {
            userId: getUidForLoggedInUser(),
            page: queryObj.page || 1,
            pageSize: queryObj.pageSize || 5,
            includeDissmissed: queryObj.includeDissmissed || false,
        })
    ).data.data.Notifications;
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

export { getUserNotifications, getNotificationPreviewImageFromNotificationData, subscribeToEpisodeNotification, unSubscribeToEpisodeNotification, handleNotificationClick, generateNotificationCss, dismissNotification };
