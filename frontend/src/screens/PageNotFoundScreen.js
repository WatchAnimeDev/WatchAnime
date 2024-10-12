import React from "react";
import naruto404Image from "../assets/images/naruto404.png";
import { Button, Group, Image, Text, Title } from "@mantine/core";
import { WATCHANIME_RED } from "../constants/cssConstants";
function PageNotFoundScreen({ message = "404", subMessage = "Oops! We cannot find the page you are looking for" }) {
    return (
        <Group sx={{ width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center", paddingTop: "56px", flexDirection: "column" }}>
            <Image src={naruto404Image} width={300}></Image>
            <Group sx={{ flexDirection: "column" }}>
                <Title>{message}</Title>
                <Text>{subMessage}</Text>
            </Group>
            <Button bg={WATCHANIME_RED} color="white" sx={{ "&:hover": { backgroundColor: WATCHANIME_RED, color: "white" } }} onClick={() => window.history.back()}>
                Back to Safety
            </Button>
        </Group>
    );
}

export default PageNotFoundScreen;
