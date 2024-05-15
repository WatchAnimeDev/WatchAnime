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

export { CatalogQueryObj };
