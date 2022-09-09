import { Anchor, Container, createStyles, Group, Text } from "@mantine/core";
import { IconBrandDiscord, IconBrandFacebook } from "@tabler/icons";
import React from "react";
import { Link } from "react-router-dom";
import footerImage from "../assets/images/footer.jpg";
import { WATCHANIME_RED } from "../constants/cssConstants";

const useStyles = createStyles((theme) => ({
    footerMainDiv: {
        backgroundImage: `url(${footerImage})`,
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
    },
    socialAndFooterLinkDiv: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 50px",
    },
    footerLink: {
        textDecoration: "none",
        color: "#C1C2C5",
        fontSize: "14px",
        "&:hover": {
            textDecoration: "none",
            color: WATCHANIME_RED,
        },
    },
    discordIcon: {
        cursor: "pointer",
        "&:hover": {
            background: "#7289d9",
            padding: "1px",
            borderRadius: "5px",
        },
    },
    facebookIcon: {
        cursor: "pointer",
        "&:hover": {
            background: "#4267B2",
            padding: "1px",
            borderRadius: "5px",
        },
    },
    copyrightText: {
        textAlign: "center",
        fontSize: "14px",
        padding: "10px 0px",
    },
    disclaimerText: {
        textAlign: "center",
        fontSize: "12px",
        color: "#757575",
    },
}));
function FooterComponent() {
    const { classes } = useStyles();
    return (
        <Container fluid className={classes.footerMainDiv} py={25}>
            <Group className={classes.socialAndFooterLinkDiv}>
                <Group sx={{ fontWeight: "400" }}>
                    <Text>JOIN US</Text>
                    <Anchor href="https://discord.gg/SvH8VJWKzN" target="_blank">
                        <IconBrandDiscord size={16} stroke={1.5} color={"white"} className={classes.discordIcon} />
                    </Anchor>
                    <Anchor href="https://www.facebook.com/groups/198603402431856" target="_blank">
                        <IconBrandFacebook size={16} stroke={1.5} color={"white"} className={classes.facebookIcon} />
                    </Anchor>
                </Group>
                <Group sx={{ fontWeight: "500" }}>
                    <Anchor component={Link} to={"/dmca"} className={classes.footerLink}>
                        DMCA
                    </Anchor>
                    <Anchor component={Link} to={"/privacy"} className={classes.footerLink}>
                        PRIVACY POLICY
                    </Anchor>
                    <Anchor component={Link} to={"/contact"} className={classes.footerLink}>
                        CONTACT
                    </Anchor>
                </Group>
            </Group>
            <Text className={classes.copyrightText}>©2022 watchanime.dev</Text>
            <Text className={classes.disclaimerText}>Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.</Text>
        </Container>
    );
}

export default FooterComponent;
