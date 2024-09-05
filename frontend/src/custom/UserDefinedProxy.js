import { getIdForLoggedInUser, pocketBaseInstance } from "./Auth";

const getProxyDetails = async () => {
    const pb = pocketBaseInstance();
    try {
        const proxyData = await pb.collection("proxy").getFirstListItem(`userId?="${getIdForLoggedInUser()}"`);
        return { id: proxyData?.id || null, url: proxyData?.url || "", useProxy: proxyData?.useProxy || false };
    } catch {
        return { id: null, url: "", useProxy: false };
    }
};

export { getProxyDetails };
