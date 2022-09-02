import { AspectRatio } from "@mantine/core";
import React from "react";

function VideoScreenIframePartial({ iframeCollectionData, selectedServer }) {
    return (
        <AspectRatio ratio={16 / 9} sx={{ width: "900px" }} mx="auto">
            <iframe src={`https://${iframeCollectionData.filter((iframeCol) => iframeCol.name === selectedServer.replace("_ad", ""))[0].iframe.replace("https://", "")}`} title={"test"} style={{ border: "none" }} allowFullScreen />
        </AspectRatio>
    );
}

export default VideoScreenIframePartial;
