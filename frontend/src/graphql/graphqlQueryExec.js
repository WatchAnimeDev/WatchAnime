import axios from "axios";
import { API_BASE_URL_V2 } from "../constants/genricConstants";

const cacheResults = new Map();

const execGraphqlQuery = async (grapqlQueryObj, variables = {}) => {
    const cacheKey = JSON.stringify({ operationName: grapqlQueryObj.operationName, variables: Object.values(variables).join("|") });
    if (!cacheResults.has(cacheKey)) {
        const fetchedData = await axios.post(API_BASE_URL_V2, { variables, ...grapqlQueryObj });
        cacheResults.set(cacheKey, fetchedData);
    }
    return cacheResults.get(cacheKey);
};
export { execGraphqlQuery };
