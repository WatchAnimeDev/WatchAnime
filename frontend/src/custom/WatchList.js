import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { WatchListQueryObj } from "../graphql/graphqlQueries";

const fetchWatchListData = async (userId, page = 1, pageSize = 20, watchlistType = 1, returnPageInfo = false) => {
    const fetchedWatchListData = await execGraphqlQuery(WatchListQueryObj, { userId, page, pageSize, watchlistType });
    return returnPageInfo ? { fetchedWatchListData: fetchedWatchListData.data.data.WatchListPage.media, fetchedWatchListDataPageInfo: fetchedWatchListData.data.data.WatchListPage.pageInfo } : fetchedWatchListData.data.data.WatchListPage.media;
};
export { fetchWatchListData };
