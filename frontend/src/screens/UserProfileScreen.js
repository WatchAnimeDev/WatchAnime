import { Badge, createStyles, Group, Image, Loader, Paper, Text } from "@mantine/core";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { getUserAvatar } from "../custom/User";
import AnimeSectionLayout from "../layouts/AnimeSectionLayout";
import { execGraphqlQuery } from "../graphql/graphqlQueryExec";
import { UserProfileQueryObject } from "../graphql/graphqlQueries";
import { userData } from "../custom/Auth";
import { STATIC_BUCKET_URL } from "../constants/genricConstants";
import PageNotFoundScreen from "./PageNotFoundScreen";

function getRoleBadge(roles) {
    return roles.map(function (role) {
        switch (role) {
            case "admin":
                return (
                    <Badge variant="gradient" gradient={{ from: "orange", to: "red" }} radius={"xs"} size="sm" key={role}>
                        Admin
                    </Badge>
                );
            default:
                return (
                    <Badge radius="xs" variant="dot" color="red" size="sm" key={role}>
                        {role}
                    </Badge>
                );
        }
    });
}

function calculatePercentage(x) {
    return Math.round((x / 240000) * 100 * 100) / 100;
}

const badgeData = [
    {
        title: "Gaijin",
        etherValue: 0,
        subTitle: "0",
    },
    {
        title: "Shoshinsha",
        etherValue: 60000,
        subTitle: "60k",
    },
    {
        title: "Sensei",
        etherValue: 120000,
        subTitle: "120k",
    },
    {
        title: "Otaku",
        etherValue: 180000,
        subTitle: "180k",
    },
    {
        title: "Weeb",
        etherValue: 240000,
        subTitle: "240k",
    },
];

const useStyles = createStyles((theme) => ({
    awardBackground: {
        width: "100%",
        paddingBottom: "40%",
        position: "absolute",
        left: "0",
        right: "0",
        top: "0",
        overflow: "hidden",
        zIndex: "-1",
        ":before": {
            content: '""',
            background: `url('${STATIC_BUCKET_URL}/live-thumb.png') repeat`,
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "2",
        },
        ":after": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "3",
            background: "linear-gradient(0deg, #1A1B1E 0, rgba(32, 31, 49, 0) 100%)",
        },
    },
    awardBackgroundImage: {
        backgroundSize: "cover",
        backgroundPosition: "center center",
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        filter: "blur(10px)",
        opacity: ".3",
    },
    iAmText: {
        fontWeight: "700",
        fontSize: "4em",
        lineHeight: "1.3",
        color: "white",
    },
    activityHeader: {
        fontWeight: "600",
        fontSize: "1.2em",
    },
    rankParent: {
        position: "relative",
        borderRadius: "2rem",
        padding: "30px 30px 0px 30px",
        backgroundColor: "rgba(255, 255, 255, .1)",
        // maxWidth: "720px",
        // margin: "0 auto 60px",
        margin: "0 0 40px",
        gap: "0px",
    },
    rank: {
        position: "relative",
        width: "20%",
        ":before": {
            content: '""',
            position: "absolute",
            left: "50%",
            bottom: "0",
            width: "1px",
            height: "30px",
            borderLeft: "1px dashed rgba(255, 255, 255, .2)",
        },
    },
    rankLine: {
        width: "80%",
        height: "2px",
        position: "relative",
        backgroundColor: "rgba(255, 255, 255, .2)",
        borderRadius: "10px",
        margin: "0 10%",
    },
    actualRankLine: {
        position: "absolute",
        left: "0",
        top: "0",
        bottom: "0",
        borderRadius: "10px",
        // background: "rgb(252,176,69)",
        background: "linear-gradient(45deg, #e8590c 0%, #e03131 100%)",
        width: "50%",
        transition: "width 1s ease-in-out",
    },
    rankLineProfilePicture: {
        position: "absolute",
        right: "-15px",
        top: "-14px",
    },
    mainLeftDiv: {
        width: "calc(70% - 20px)",
        flexDirection: "column",
        gap: "0px",
        alignItems: "flex-start",
        [theme.fn.smallerThan("md")]: {
            width: "100%",
        },
    },
    mainRightDiv: {
        gap: "48px",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "30%",
        [theme.fn.smallerThan("md")]: {
            width: "100%",
        },
    },
    userStatsDiv: {
        gap: "0px",
        flexWrap: "nowrap",
        marginLeft: "30px",
        width: "100%",
        [theme.fn.smallerThan("md")]: {
            marginLeft: "0px",
        },
    },
}));

function UserProfileScreen() {
    const { classes } = useStyles();
    // const pbUserData = userData().model;
    const [currentUserData, setCurrentUserData] = useState({});
    const [ether, setEther] = useState(0);
    const [watchlistData, setWatchlistData] = useState([]);
    const [userWatchStats, setUserWatchStats] = useState({
        totalEpisodeWatchedCount: 0,
        totalDuration: 0,
        totalAnimeWatchedCount: 0,
    });
    const [ajaxComplete, setAjaxComplete] = useState(false);

    useEffect(() => {
        async function getUserData() {
            const username = window.location.pathname.replace("/profile", "").replace("/", "") || userData().model.username;
            const totalData = (await execGraphqlQuery(UserProfileQueryObject, { username: username })).data.data.UserProfile;
            setWatchlistData(totalData.watchList.media);
            setCurrentUserData(totalData.userData);
            setUserWatchStats(totalData.watchStatistics);
            setTimeout(() => {
                setEther(totalData.etherCount);
            }, 500);
            setAjaxComplete(true);
        }

        getUserData();
    }, []);

    function getEtherBadge() {
        return (
            <Group pos={"relative"} w={"100%"} sx={{ justifyContent: "space-around", gap: "0px" }}>
                {badgeData.map((data, index) => {
                    return (
                        <Group key={index} className={classes.rank} sx={{ flexDirection: "column" }} pb={"50px"}>
                            <Text color="white" fw={"600"}>
                                {data.title}
                            </Text>
                            <Group sx={{ gap: "5px" }}>
                                <Image w={"16px !important"} src={`${STATIC_BUCKET_URL}/crypto.png`}></Image>
                                <Text>{data.subTitle}</Text>
                            </Group>
                            <Image w={"80px !important"} src={`${STATIC_BUCKET_URL}/ranks/${index + 1}.png`} />
                        </Group>
                    );
                })}
            </Group>
        );
    }

    return ajaxComplete ? (
        currentUserData.id ? (
            <Group pt={56} px={50} sx={{ maxWidth: "1230px", margin: "0 auto" }}>
                <Paper className={classes.awardBackground}>
                    <Paper className={classes.awardBackgroundImage} style={{ backgroundImage: `url('${getUserAvatar(currentUserData)}')` }}></Paper>
                </Paper>
                <Group w={"100%"}>
                    <Group py={50} w={"100%"} sx={{ flexDirection: "column", gap: "0px" }}>
                        <Group className={classes.iAmText} sx={{ flexDirection: "column", gap: "0px" }}>
                            <Text>Hi! I'm</Text>
                            <Text>{currentUserData.name}</Text>
                        </Group>
                        {currentUserData.verified && (
                            <Badge my={"1rem"} variant="filled" leftSection={<IconRosetteDiscountCheckFilled style={{ display: "flex", alignItems: "center" }} size={16} />} size="lg" bg="rgb(29, 155, 240)">
                                Verified
                            </Badge>
                        )}
                    </Group>
                </Group>
                <Group w={"100%"} sx={{ gap: "20px", alignItems: "flex-start" }} mb={"40px"}>
                    <Group className={classes.mainLeftDiv}>
                        <Group mb={"40px"} sx={{ gap: "68px" }}>
                            <Group>
                                <Image radius="50%" src={getUserAvatar(currentUserData)} width={"60px"} height={"60px"} />
                                <Group sx={{ flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
                                    <Text color="white" sx={{ fontSize: "18px", fontWeight: "600" }}>
                                        {currentUserData.username}
                                    </Text>
                                    <Group sx={{ gap: "5px" }}>{getRoleBadge(currentUserData.roles)}</Group>
                                    {/* <Text sx={{ fontSize: "14px" }}>Joined {currentUserData.created.split(" ")[0]}</Text> */}
                                </Group>
                            </Group>
                            <Group sx={{ flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
                                <Group sx={{ gap: "10px" }}>
                                    <Text fw={"600"}>Ether:</Text>
                                    <Group sx={{ gap: "2px" }}>
                                        <Image w={"16px !important"} src={`${STATIC_BUCKET_URL}/crypto.png`}></Image>
                                        <Text fw={"600"}>{ether < 1000 ? ether : `${Math.round((ether / 1000) * 100) / 100}k`}</Text>
                                    </Group>
                                </Group>
                                <Group sx={{ gap: "10px" }}>
                                    <Paper sx={{ width: "50px", height: "12px", padding: "2px", borderRadius: "10px", border: "1px solid white" }}>
                                        <Paper w={50 * (ether / 240000)} sx={{ position: "absolute", backgroundColor: "white", height: "6px", borderRadius: "6px" }}></Paper>
                                    </Paper>
                                    <Text>{calculatePercentage(ether)}%</Text>
                                </Group>
                            </Group>
                        </Group>
                        <Group className={classes.rankParent} w={"100%"}>
                            {getEtherBadge()}
                            <Paper className={classes.rankLine}>
                                <Paper className={classes.actualRankLine} w={`${calculatePercentage(ether)}%`}>
                                    <Image height={"30px"} width={"30px"} radius="50%" className={classes.rankLineProfilePicture} src={getUserAvatar(currentUserData)}></Image>
                                </Paper>
                            </Paper>
                        </Group>
                        <Group sx={{ flexDirection: "column", alignItems: "flex-start", gap: "1.5rem" }} w={"100%"}>
                            <Text sx={{ fontSize: "20px", fontWeight: "700" }}>WatchList</Text>
                            <Group w={"100%"} sx={!watchlistData?.length ? { justifyContent: "center" } : {}}>
                                {watchlistData?.length ? (
                                    watchlistData.map((genericData, ind) => <AnimeSectionLayout anime={genericData} key={ind} />)
                                ) : (
                                    <Paper sx={{ minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Text>WatchList is either empty or private.</Text>
                                    </Paper>
                                )}
                            </Group>
                        </Group>
                    </Group>
                    <Group className={classes.mainRightDiv}>
                        <Group sx={{ gap: "20px", flexDirection: "column", alignItems: "flex-start" }} w={"100%"}>
                            <Group sx={{ borderLeft: "1px solid rgba(255,255,255,.1)" }} pl={30}>
                                <Text className={classes.activityHeader}>User Statistics</Text>
                            </Group>
                            <Group className={classes.userStatsDiv}>
                                <Group sx={{ justifyContent: "center", gap: "5px", flexDirection: "column" }} w={"33.33%"}>
                                    <Text color={"#fed219"}>{userWatchStats.totalAnimeWatchedCount}</Text>
                                    <Text sx={{ textAlign: "center", fontSize: "13px" }}>Animes Watched</Text>
                                </Group>
                                <Group sx={{ justifyContent: "center", gap: "5px", flexDirection: "column" }} w={"33.33%"}>
                                    <Text color={"#fed219"}>{userWatchStats.totalEpisodeWatchedCount}</Text>
                                    <Text sx={{ textAlign: "center", fontSize: "13px" }}>Episodes Watched</Text>
                                </Group>
                                <Group sx={{ justifyContent: "center", gap: "5px", flexDirection: "column" }} w={"33.33%"}>
                                    <Text color={"#fed219"}>{Math.floor(userWatchStats.totalDuration / 3600)}</Text>
                                    <Text sx={{ textAlign: "center", fontSize: "13px" }}>Hours Spent</Text>
                                </Group>
                            </Group>
                        </Group>
                        <Group sx={{ gap: "20px" }} w={"100%"}>
                            <Group sx={{ borderLeft: "1px solid rgba(255,255,255,.1)" }} pl={30}>
                                <Text className={classes.activityHeader}>Latest Activities</Text>
                            </Group>
                            <Group sx={{ justifyContent: "center", alignItems: "center", width: "100%", minHeight: "100px" }}>
                                <Text>No activities found</Text>
                            </Group>
                        </Group>
                    </Group>
                </Group>
            </Group>
        ) : (
            <PageNotFoundScreen subMessage="User Profile not found" />
        )
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default UserProfileScreen;
