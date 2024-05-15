import axios from "axios";
import { API_BASE_URL_V2 } from "../constants/genricConstants";

const cacheResults = new Map();

/**
 * Executes graphql query and returns data.
 * Caches data once queried and returns from cache for subsquent queries
 * @param {*} grapqlQueryObj {query, operationName}
 * @param {*} variables {}
 * @param {int} ttl time in minutes
 * @returns
 */
const execGraphqlQuery = async (grapqlQueryObj, variables = {}, ttl = 60) => {
    const cacheKey = JSON.stringify({ operationName: grapqlQueryObj.operationName, variables: Object.values(variables).join("|") });
    if (!cacheResults.has(cacheKey) || cacheResults.get(cacheKey).ttl < Date.now() / 1000) {
        const fetchedData = await axios.post(API_BASE_URL_V2, { variables, ...grapqlQueryObj });
        cacheResults.set(cacheKey, { fetchedData, ttl: Date.now() / 1000 + ttl * 60 });
    }
    console.log(cacheResults);
    return cacheResults.get(cacheKey).fetchedData;
};
export { execGraphqlQuery };
