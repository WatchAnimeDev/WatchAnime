import axios from "axios";
import { API_BASE_URL, AUTH_BASE_URL, STATIC_BUCKET_URL } from "../constants/genricConstants";
import { pocketBaseInstance, userData } from "./Auth";

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}
function getUid() {
    return localStorage.getItem("uid");
}
async function setUid() {
    let uid = null;
    try {
        let uidData = await axios.get(`${API_BASE_URL}/auth/uid/set`);
        uid = uidData.data?.anonUid || uuidv4();
    } catch (error) {
        uid = uuidv4();
    }
    localStorage.setItem("uid", uid);
}
function getOrSetUid() {
    if (getUid()) {
        return getUid();
    }
    setUid();
    return getUid();
}

function getUserAvatar(userDataModel = null) {
    userDataModel = userDataModel || userData().model;
    return userDataModel?.avatar ? `${AUTH_BASE_URL}/api/files/_pb_users_auth_/${userDataModel.id}/${userDataModel.avatar}` : `${STATIC_BUCKET_URL}/killua.jpg`;
}

async function findPocketBaseUserByUserName(username) {
    const pb = pocketBaseInstance();
    try {
        const proxyData = await pb.collection("users_view").getFirstListItem(`username?="${username}"`);
        return proxyData || {};
    } catch {
        return {};
    }
}

export { getOrSetUid, uuidv4, getUserAvatar, findPocketBaseUserByUserName };
