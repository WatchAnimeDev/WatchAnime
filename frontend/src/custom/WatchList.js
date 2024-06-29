import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { WatchListQueryObj } from "../graphql/graphqlQueries";

const fetchWatchListData = async (userId, page = 1, pageSize = 20, watchlistType = 1) => {
    const fetchedWatchListData = await execGraphqlQuery(WatchListQueryObj, { userId, page, pageSize, watchlistType });
    return { fetchedWatchListData: fetchedWatchListData.data.data.WatchListPage.media, fetchedWatchListDataPageInfo: fetchedWatchListData.data.data.WatchListPage.pageInfo };
};
export { fetchWatchListData };
