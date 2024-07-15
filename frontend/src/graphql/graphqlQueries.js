// import { gql } from "@apollo/client";

import { NOTIFICATION_BASE_URL_V2 } from "../constants/genricConstants";

const CatalogQuery = `
    query CatalogQuery(
        $page: Int
        $pageSize: Int
        $name: String
        $type: String
        $source: String
        $status: String
        $rating: String
        $season: String
        $scoremin: Float
        $scoremax: Float
        $genres: String
        $notdub: Boolean
        $sortby: String
        $sortorder: String
    ) {
        Page(page: $page, pageSize: $pageSize) {
            media(name: $name, type: $type, source: $source, status: $status, rating: $rating, season: $season, scoremin: $scoremin, scoremax: $scoremax, genres: $genres, notdub: $notdub, sortby: $sortby, sortorder: $sortorder) {
                slug
                images {
                    jpg {
                        image_url
                        large_image_url
                        small_image_url
                    }
                    webp {
                        image_url
                        large_image_url
                        small_image_url
                    }
                    png {
                        image_url
                        large_image_url
                        small_image_url
                    }
                }
                titles {
                    title
                    type
                }
                genres {
                    mal_id
                    name
                    type
                    url
                }
                type
            }
            pageInfo {
                currentPage
                hasNextPage
                perPage
                lastPage
                total
            }
        }
    }
`;

const CatalogQueryObj = {
    query: CatalogQuery,
    operationName: "CatalogQuery",
};

const WatchListQuery = `
    query WatchListPageQuery(
        $userId: String
        $watchlistType: Float
        $page: Int
        $pageSize: Int
    ) {
        WatchListPage(page: $page, pageSize: $pageSize) {
            media(userId: $userId, watchlistType: $watchlistType) {
                slug
                images {
                    jpg {
                        image_url
                        large_image_url
                        small_image_url
                    }
                    webp {
                        image_url
                        large_image_url
                        small_image_url
                    }
                    png {
                        image_url
                        large_image_url
                        small_image_url
                    }
                }
                titles {
                    title
                    type
                }
                genres {
                    mal_id
                    name
                    type
                    url
                }
                type
                watchlistType
            }
            pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
            }
        }
    }
`;

const WatchListQueryObj = {
    query: WatchListQuery,
    operationName: "WatchListPageQuery",
};

const WatchListEditTypeMutation = `
    mutation WatchListEditTypeMutation($userId: String, $watchlistType: Float, $slugId: String) {
        UpdateWatchListMediaType(
            userId: $userId
            watchlistType: $watchlistType
            slugId: $slugId
        )
    }
`;

const WatchListEditTypeMutationObj = {
    query: WatchListEditTypeMutation,
    operationName: "WatchListEditTypeMutation",
};

const PopularQuery = `
    query PopularQuery($page: Int) {
        Popular(page: $page) {
            slug
            images {
                jpg {
                    image_url
                    large_image_url
                    small_image_url
                }
                webp {
                    image_url
                    large_image_url
                    small_image_url
                }
                png {
                    image_url
                    large_image_url
                    small_image_url
                }
            }
            titles {
                title
                type
            }
            genres {
                mal_id
                name
                type
                url
            }
            type
            aired {
                string
            }
            bannerImage
            trailer {
                deliveryUrl
            }
            tmdbData {
                backdrops {
                    file_path
                }
                logos {
                    file_path
                }
            }
            synopsis
        }
    }
`;

const PopularQueryObject = {
    query: PopularQuery,
    operationName: "PopularQuery",
};

const RecentQuery = `
    query RecentQuery($page: Int) {
        Recent(page: $page) {
            slug
            images {
                jpg {
                    image_url
                    large_image_url
                    small_image_url
                }
                webp {
                    image_url
                    large_image_url
                    small_image_url
                }
                png {
                    image_url
                    large_image_url
                    small_image_url
                }
            }
            titles {
                title
                type
            }
            genres {
                mal_id
                name
                type
                url
            }
            type
            currentReleasedEpisode
        }
    }
`;

const RecentQueryObject = {
    query: RecentQuery,
    operationName: "RecentQuery",
};

const ScheduleQuery = `
    query ScheduleQuery {
        Schedule {
            slug
            time
            titles {
                title
                type
            }
        }
    }
`;

const ScheduleQueryObject = {
    query: ScheduleQuery,
    operationName: "ScheduleQuery",
};

const MergeQuery = `
    query MergeQuery($page: Int) {
        Popular(page: $page) {
            slug,
            images {
                jpg {
                    image_url
                    large_image_url
                    small_image_url
                }
                png {
                    image_url
                    large_image_url
                    small_image_url
                }
                webp {
                    image_url
                    large_image_url
                    small_image_url
                }
            }
            titles {
                title
                type
            }
            genres {
                mal_id
                name
                type
                url
            }
            type
            aired {
                string
            }
            bannerImage
            trailer {
                deliveryUrl
            }
            tmdbData {
                backdrops {
                    file_path
                }
                logos {
                    file_path
                }
            }
            synopsis
            score
        }
        Recent(page: $page) {
            slug
            images {
                jpg {
                    image_url
                    large_image_url
                    small_image_url
                }
                png {
                    image_url
                    large_image_url
                    small_image_url
                }
                webp {
                    image_url
                    large_image_url
                    small_image_url
                }
            }
            titles {
                title
                type
            }
            genres {
                mal_id
                name
                type
                url
            }
            type
            currentReleasedEpisode
        }
        Schedule {
            slug
            time
            titles {
                title
                type
            }
        }
    }
`;

const MergeQueryObject = {
    query: MergeQuery,
    operationName: "MergeQuery",
};

const SearchQuery = `
    query SearchQuery($page: Int, $pageSize: Int, $name: String) {
        Page(page: $page, pageSize: $pageSize) {
            media(name: $name) {
                slug
                synopsis
                images {
                    jpg {
                        image_url
                        medium_image_url
                        large_image_url
                    }
                    webp {
                        image_url
                        medium_image_url
                        large_image_url
                    }
                    png {
                        image_url
                        medium_image_url
                        large_image_url
                    }
                }
                titles {
                    title
                    type
                }
            }
        }
    }
`;

const SearchQueryObject = {
    query: SearchQuery,
    operationName: "SearchQuery",
};

const AnimeQuery = `
    query AnimeQuery($page: Int, $pageSize: Int, $slug: String) {
        Page(page: $page, pageSize: $pageSize) {
            media(slug: $slug) {
                slug
                synopsis
                malId
                aniId
                duration
                score
                aired {
                    string
                }
                status
                genres {
                    name
                }
                studios {
                    name
                }
                episodes
                images {
                    jpg {
                        image_url
                        medium_image_url
                        large_image_url
                    }
                    webp {
                        image_url
                        medium_image_url
                        large_image_url
                    }
                    png {
                        image_url
                        medium_image_url
                        large_image_url
                    }
                }
                titles {
                    title
                    type
                }
                relations {
                    entry {
                        slug
                        images {
                            jpg {
                            image_url
                            large_image_url
                            small_image_url
                            }
                            webp {
                            image_url
                            large_image_url
                            small_image_url
                            }
                            png {
                            image_url
                            large_image_url
                            small_image_url
                            }
                        }
                        titles {
                            title
                            type
                        }
                        genres {
                            name
                        }
                    }
                }
                hasDub
            }
        }
    }
`;

const AnimeQueryObject = {
    query: AnimeQuery,
    operationName: "AnimeQuery",
};

const NotificationQuery = `
    query NotificationQuery(
        $page: Int
        $pageSize: Int
        $userId: String
        $includeDissmissed: Boolean
        $excludeAnnouncements: Boolean
    ) {
        Page(page: $page, pageSize: $pageSize) {
            notifications(
                userId: $userId
                includeDissmissed: $includeDissmissed
                excludeAnnouncements: $excludeAnnouncements
            ) {
            createdAt
            episode_number
            epnotifid
            is_notif_dissmissed
            is_notif_read
            notif_type
            sender
            slug_id
            userid
            usernotifstatusid
            announcenotifid
            title
            expireAt
            message
            media {
                    images {
                        jpg {
                            image_url
                            medium_image_url
                            large_image_url
                        }
                        png {
                            image_url
                            medium_image_url
                            large_image_url
                        }
                        webp {
                            image_url
                            medium_image_url
                            large_image_url
                        }
                    }
                    titles {
                        title
                        type
                    }
                }
            }
            pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
            }
        }
    }
`;

const NotificationQueryObject = {
    query: NotificationQuery,
    operationName: "NotificationQuery",
    endpoint: NOTIFICATION_BASE_URL_V2,
};

const WatchListMalImportMutation = `
    mutation WatchListMalImportMutation($userId: String, $malUserName: String, $clearWatchList: Boolean) {
        ImportMalWatchlistData(
            userId: $userId
            malUserName: $malUserName
            clearWatchList: $clearWatchList
        )
    }
`;

const WatchListMalImportMutationObj = {
    query: WatchListMalImportMutation,
    operationName: "WatchListMalImportMutation",
};

export { CatalogQueryObj, WatchListQueryObj, PopularQueryObject, RecentQueryObject, ScheduleQueryObject, MergeQueryObject, SearchQueryObject, AnimeQueryObject, NotificationQueryObject, WatchListEditTypeMutationObj, WatchListMalImportMutationObj };
