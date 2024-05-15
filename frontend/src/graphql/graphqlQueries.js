// import { gql } from "@apollo/client";

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
    query WatchListQuery($userId: String) {
        WatchList(userId: $userId) {
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
    }
`;

const WatchListQueryObj = {
    query: WatchListQuery,
    operationName: "WatchListQuery",
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

export { CatalogQueryObj, WatchListQueryObj, PopularQueryObject, RecentQueryObject, ScheduleQueryObject, MergeQueryObject };
