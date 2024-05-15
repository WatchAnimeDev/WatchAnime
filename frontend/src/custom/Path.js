function getPathType(path = window.location.pathname) {
    if (/^(\/signin|\/signup|\/reset)$/.test(path)) {
        return "auth";
    } else if (path === "/dashboard") {
        return "dashboard";
    } else {
        return "home";
    }
}

export { getPathType };
