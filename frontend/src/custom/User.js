import axios from "axios";
import { API_BASE_URL } from "../constants/genricConstants";

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

export { getOrSetUid, uuidv4 };
