import { Anchor, Container, createStyles, Group, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";
import footerImage from "../assets/images/footer.jpg";
import { WATCHANIME_RED } from "../constants/cssConstants";
import JoinUsPartial from "../partials/JoinUsPartial";

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
                <JoinUsPartial />
                <Group sx={{ fontWeight: "500" }}>
                    <Anchor href="https://status.watchanime.dev/" target="_blank" className={classes.footerLink}>
                        STATUS
                    </Anchor>
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
