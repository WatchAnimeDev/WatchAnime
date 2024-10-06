import { Badge, createStyles, Group, Image, Loader, Paper, Text } from "@mantine/core";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { userData } from "../custom/Auth";
import { findPocketBaseUserByUserName, getUserAvatar } from "../custom/User";
import { fetchWatchListData } from "../custom/WatchList";
import AnimeSectionLayout from "../layouts/AnimeSectionLayout";

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
    const segments = [1000, 1500, 2000, 2500, 3000];
    const percentages = [0, 20, 40, 60, 80];

    let cumulative = 0;

    for (let i = 0; i < segments.length; i++) {
        if (x < cumulative + segments[i]) {
            return percentages[i] + ((x - cumulative) / segments[i]) * 20;
        }
        cumulative += segments[i];
    }

    return 100;
}

function getEtherBadge() {}

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
            background: "url('https://hianime.to/images/live-thumb.png') repeat",
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
}));

function UserProfileScreen() {
    const { classes } = useStyles();
    // const pbUserData = userData().model;
    const [currentUserData, setCurrentUserData] = useState({});
    const [wbucks, setWbucks] = useState(1980);
    const [watchlistData, setWatchlistData] = useState([]);
    const [ajaxComplete, setAjaxComplete] = useState(false);

    useEffect(() => {
        async function getUserData() {
            const data = await findPocketBaseUserByUserName("duxorhell_test");
            const watchlistDataFetched = await fetchWatchListData(data.anon_uid, 1, 9, 0);
            setWatchlistData(watchlistDataFetched);
            setCurrentUserData(data);
            setAjaxComplete(true);
        }

        getUserData();
    }, []);

    return ajaxComplete ? (
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
                <Group w={"calc(70% - 20px)"} sx={{ flexDirection: "column", gap: "0px", alignItems: "flex-start" }}>
                    <Group mb={"40px"}>
                        <Image radius="50%" src={getUserAvatar(currentUserData)} width={"60px"} height={"60px"} />
                        <Group sx={{ flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
                            <Text color="white" sx={{ fontSize: "18px" }}>
                                {currentUserData.username}
                            </Text>
                            <Group sx={{ gap: "5px" }}>{getRoleBadge(currentUserData.roles)}</Group>
                            {/* <Text sx={{ fontSize: "14px" }}>Joined {currentUserData.created.split(" ")[0]}</Text> */}
                        </Group>
                    </Group>
                    <Group className={classes.rankParent} w={"100%"}>
                        <Group pos={"relative"} w={"100%"} sx={{ justifyContent: "space-around", gap: "0px" }}>
                            <Group className={classes.rank} sx={{ flexDirection: "column" }} pb={"50px"}>
                                <Text>Unranked</Text>
                                <Text>The Beginner</Text>
                                <Image w={"80px !important"} src={"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/0e457516ba13817a45b6c2a1d262fe7d0599bcbc/csgo/pak01_dir/resource/flash/econ/status_icons/skillgroup_expired.png"} />
                            </Group>
                            <Group className={classes.rank} sx={{ flexDirection: "column" }} pb={"50px"}>
                                <Text>Silver I</Text>
                                <Group>
                                    <Text>1.5K wBucks</Text>
                                </Group>
                                <Image w={"80px !important"} src={"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/0e457516ba13817a45b6c2a1d262fe7d0599bcbc/csgo/pak01_dir/resource/flash/econ/status_icons/skillgroup1.png"} />
                            </Group>
                            <Group className={classes.rank} sx={{ flexDirection: "column" }} pb={"50px"}>
                                <Text>Silver II</Text>
                                <Text>Let's Go</Text>
                                <Image w={"80px !important"} src={"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/0e457516ba13817a45b6c2a1d262fe7d0599bcbc/csgo/pak01_dir/resource/flash/econ/status_icons/skillgroup2.png"} />
                            </Group>
                            <Group className={classes.rank} sx={{ flexDirection: "column" }} pb={"50px"}>
                                <Text>Silver III</Text>
                                <Text>Let's Go</Text>
                                <Image w={"80px !important"} src={"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/0e457516ba13817a45b6c2a1d262fe7d0599bcbc/csgo/pak01_dir/resource/flash/econ/status_icons/skillgroup3.png"} />
                            </Group>
                            <Group className={classes.rank} sx={{ flexDirection: "column" }} pb={"50px"}>
                                <Text>Silver IV</Text>
                                <Text>Let's Go</Text>
                                <Image w={"80px !important"} src={"https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/0e457516ba13817a45b6c2a1d262fe7d0599bcbc/csgo/pak01_dir/resource/flash/econ/status_icons/skillgroup4.png"} />
                            </Group>
                        </Group>
                        <Paper className={classes.rankLine}>
                            <Paper className={classes.actualRankLine} w={`${calculatePercentage(wbucks)}%`}>
                                <Image height={"30px"} width={"30px"} radius="50%" className={classes.rankLineProfilePicture} src={getUserAvatar(currentUserData)}></Image>
                            </Paper>
                        </Paper>
                    </Group>
                    <Group sx={{ flexDirection: "column", alignItems: "flex-start", gap: "1.5rem" }}>
                        <Text sx={{ fontSize: "20px", fontWeight: "700" }}>WatchList</Text>
                        <Group>
                            {watchlistData.fetchedWatchListData.map((genericData, ind) => (
                                <AnimeSectionLayout anime={genericData} key={ind} />
                            ))}
                        </Group>
                    </Group>
                </Group>
                <Group w={"30%"} sx={{ borderLeft: "1px solid rgba(255,255,255,.1)" }} pl={30}>
                    <Text className={classes.activityHeader}>Latest Activities</Text>
                </Group>
            </Group>
        </Group>
    ) : (
        <Loader sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
    );
}

export default UserProfileScreen;
