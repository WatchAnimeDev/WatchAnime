import { Container, Group, Text, Title } from "@mantine/core";
import React from "react";
import SideBarComponent from "../components/SideBarComponent";

function DmcaScreen({ sideBarState, setSideBarState, bugReportState, setBugReportState }) {
    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }],
    };
    return (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ bugReportState, setBugReportState }} />
            <Container sx={{ padding: "80px" }} fluid>
                <Group>
                    <Group>
                        <Title>Information we may collect</Title>
                        <Text>
                            We may collect some information about our visitors. This information is not limited to IP addresses, timestamps and browser details. But, we ensure that information cannot identify specific visitor of this site. We collect this
                            information to improve our website and increase users comfort. We will not provide or sell any of collected information to third parties. Also if necessary our website use cookies to store information about user preferences or
                            details needed to run all of the website features properly. You may disable cookies on our website, but this can affect some of our features to work.
                        </Text>
                    </Group>
                    <Group>
                        <Title>Legal Disclaimer</Title>
                        <Text>
                            The author is not responsible for any contents linked or referred to from his pages - If any damage occurs by the use of information presented there, only the author of the respective pages might be liable, not the one who has
                            linked to these pages. WatchAnime.dev doesn't host any content. WatchAnime.dev crawls third-party streamable urls from third-party websites such as GogoAnime, 9Anime and AnimeDao. WatchAnime.dev organizes and presents all
                            crawled information in a way to improve user experience and make it easily searchable . No content is ever uploaded by WatchAnime.dev to it's own servers or to any third-party streamable servers. Third-party websites such as
                            GogoAnime, 9Anime and AnimeDao or it's users upload the content to video streaming websites (such as Google Video, VidCDN, VidStreaming, Fembed, Cloud9, Mp4Upload, Hydrax) and create streamable urls, not WatchAnime. All Google
                            Video, VidCDN, VidStreaming, Fembed, Cloud9, Mp4Upload, Hydrax users signed a contract with the sites when they set up their accounts which forces them not to upload illegal content. The streaming websites (such as Google Video,
                            VidCDN, VidStreaming, Fembed, Cloud9, Mp4Upload, Hydrax) are the ones hosting and distributing the content, not WatchAnime. WatchAnime doesn't act for commercial purposes. By clicking on any Links to videos while surfing on
                            WatchAnime you watch content uploaded by third parties and hosted on third parties and WatchAnime cant take the responsibility for any content hosted on other sites. All trademarks, Videos, trade names, service marks,
                            copyrighted work, logos referenced herein belong to their respective owners/companies. WatchAnime.dev is not responsible for what other people are uploading to 3rd party sites. We encourage all copyright owners, to recognize
                            that videos embedded are from other various site like included above!. If you have any legal issues please contact appropriate media file owners / hosters.
                        </Text>
                    </Group>
                </Group>
            </Container>
        </>
    );
}

export default DmcaScreen;
