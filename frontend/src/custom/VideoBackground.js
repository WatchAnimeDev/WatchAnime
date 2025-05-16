const toggleVideoVolume = (isMuted, setVideoMuted, player) => {
    if (!player) return;
    if (isMuted) {
        player.unMute();
    } else {
        player.mute();
    }
    setVideoMuted(!isMuted);
};

const isVideoHeaderEnabled = (animeData, isMobile) => {
    return Boolean(!isMobile && animeData?.trailer?.youtube_id);
};

export { toggleVideoVolume, isVideoHeaderEnabled };
