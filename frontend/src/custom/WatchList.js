import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { WatchListQueryObj } from "../graphql/graphqlQueries";

const fetchWatchListData = async (userId) => {
    return await (
        await execGraphqlQuery(WatchListQueryObj, { userId })
    ).data.data.WatchList;
};
export { fetchWatchListData };
