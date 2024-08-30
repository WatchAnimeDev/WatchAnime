import axios from "axios";

const getAnimeSkipData = async (animeData, episodeNumber, duration) => {
    try {
        if (!animeData.malId) {
            return [];
        }
        const skipTypeMap = { ed: "SKIP ENDING", op: "SKIP OPENING" };
        const skipData = (await axios.get(`https://api.aniskip.com/v2/skip-times/${animeData.malId}/${episodeNumber}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=${duration}`)).data.results;
        let formattedSkipData = [];
        for (const eachSkipData of skipData) {
            if (Object.keys(skipTypeMap).includes(eachSkipData.skipType))
                formattedSkipData.push({
                    type: eachSkipData.skipType,
                    displayString: skipTypeMap[eachSkipData.skipType],
                    startTime: eachSkipData.interval.startTime,
                    endTime: eachSkipData.interval.endTime,
                });
        }
        return formattedSkipData;
    } catch (e) {
        return [];
    }
};

export { getAnimeSkipData };
