const toggleVideoVolume = (isMuted, setVideoMuted, videoPlayerRef) => {
    videoPlayerRef.current.muted = !isMuted;
    setVideoMuted(!isMuted);
};

const isVideoHeaderEnabled = (animeData, isMobile) => {
    return Boolean(!isMobile && animeData?.trailer?.deliveryUrl);
};

export { toggleVideoVolume, isVideoHeaderEnabled };
