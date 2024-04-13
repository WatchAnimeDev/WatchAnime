import axios from "axios";
import { API_BASE_URL } from "../constants/genricConstants";

const fetchWatchListData = async (userId) => {
    return (await axios.get(`${API_BASE_URL}/watchlist/get/${userId}`)).data;
};
export { fetchWatchListData };
