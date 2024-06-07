/**
 * Returns the type of the given path.
 *
 * @param {string} [path=window.location.pathname] - The path to check.
 * @return {string} The type of the path: "auth", "dashboard", or "home".
 */
function getPathType(path = window.location.pathname) {
    if (["signin", "signup", "reset"].some((part) => path.includes(part))) {
        return "auth";
    } else if (path.includes("dashboard")) {
        return "dashboard";
    } else {
        return "home";
    }
}

export { getPathType };
