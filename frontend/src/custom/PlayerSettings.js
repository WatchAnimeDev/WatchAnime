function getPlayerSettings(section = null) {
    let settings = JSON.parse(localStorage.getItem("playerSettings") || "{}");
    return section ? settings[section] : settings;
}
function setPlayerSettings(data, section = null) {
    let settings = getPlayerSettings();
    if (section) {
        settings[section] = data;
    } else {
        settings = data;
    }
    localStorage.setItem("playerSettings", JSON.stringify(settings));
}

export { getPlayerSettings, setPlayerSettings };
