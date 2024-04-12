function isResetPage(path = null) {
    if (!path) {
        path = window.location.pathname;
    }
    const regex = /^(\/reset)$/;
    return regex.test(path);
}

function resetData() {
    localStorage.clear();
}
export { isResetPage, resetData };
