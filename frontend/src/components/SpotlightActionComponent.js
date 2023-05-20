import React from "react";
import { Group, Text, Anchor, Flex } from "@mantine/core";
import { Link } from "react-router-dom";
import { closeSpotlight } from "@mantine/spotlight";

function SpotlightActionComponent({ children }) {
    return (
        <div>
            {children}
            <Group
                position="apart"
                px={15}
                py="xs"
                sx={(theme) => ({
                    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                })}
            >
                <Flex align={"center"}>
                    <Text size="xs" color="dimmed">
                        Search powered by{" "}
                    </Text>
                    <Text size="xs" sx={{ marginLeft: "3px" }}>
                        Watchanime
                    </Text>
                </Flex>

                {children.props.query && children.props.actions.length ? (
                    <Anchor size="xs" href="#" component={Link} to={`/catalog?name=${children.props.query}`} onClick={(e) => closeSpotlight()}>
                        View more
                    </Anchor>
                ) : (
                    ""
                )}
            </Group>
        </div>
    );
}

export default SpotlightActionComponent;
