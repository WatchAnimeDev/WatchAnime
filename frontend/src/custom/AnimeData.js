function getImageByRelevance(images, size, type = "") {
    if (images.webp && (!type || type === "webp")) {
        return images.webp[size] ?? images.webp[Object.keys(images.webp)[0]];
    }
    if (images.jpg && (!type || type === "jpg")) {
        return images.jpg[size] ?? images.jpg[Object.keys(images.jpg)[0]];
    }
    if (images.png && (!type || type === "png")) {
        return images.png[size] ?? images.png[Object.keys(images.png)[0]];
    }
}

function getAnimeTitleByRelevance(titles, isDub) {
    const defaultTitle = titles.filter((eachTitle) => eachTitle.type === "Default");
    return `${defaultTitle.length ? defaultTitle[0].title : titles[0].title}${isDub ? " (DUB)" : ""}`;
}

const toTitleCase = (phrase) => {
    return phrase
        .toLowerCase()
        .split(",")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(",");
};

export { getImageByRelevance, getAnimeTitleByRelevance, toTitleCase };
