import React from "react";
import { Group, Image, Title } from "@mantine/core";
import { STATIC_BUCKET_URL } from "../constants/genricConstants";

function InformationPikachuPartial({ message, subMessage }) {
    return (
        <Group width={"100%"} h={"100%"} sx={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Image sx={{ width: "100px !important" }} src={`${STATIC_BUCKET_URL}/5bbcd1c92dcb3-31f1a3512e407e7e5150ddeff4a65c38.png`} />
            <Title order={1}>{message}</Title>
            {subMessage ? <Title order={6}>{subMessage}</Title> : <></>}
        </Group>
    );
}

export default InformationPikachuPartial;
