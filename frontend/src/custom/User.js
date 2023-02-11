function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}
function getUid() {
    return localStorage.getItem("uid");
}
function setUid() {
    localStorage.setItem("uid", uuidv4());
}
function getOrSetUid() {
    if (getUid()) {
        return getUid();
    }
    setUid();
    return getUid();
}

export { getOrSetUid, uuidv4 };
