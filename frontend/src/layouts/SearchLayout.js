import React from "react";
import { createStyles, UnstyledButton, Group, Text, Image, Center, Badge } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    action: {
        position: "relative",
        display: "block",
        width: "100%",
        padding: "10px 12px",
        borderRadius: theme.radius.sm,
    },

    actionHovered: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1],
    },

    actionBody: {
        flexGrow: "1",
    },
}));

function SearchLayout({ action, styles, classNames, hovered, onTrigger, ...others }) {
    if (Object.keys(others).includes("highlightQuery")) {
        delete others.highlightQuery;
    }
    const { classes, cx } = useStyles(null, { styles, classNames, name: "Spotlight" });
    return (
        <UnstyledButton className={cx(classes.action, { [classes.actionHovered]: hovered })} tabIndex={-1} onMouseDown={(event) => event.preventDefault()} onClick={onTrigger} {...others}>
            <Group noWrap>
                {action.image && (
                    <Center>
                        <Image src={action.image} alt={action.title} width={50} height={50} />
                    </Center>
                )}

                <div className={classes.actionBody}>
                    <Text>{action.title}</Text>

                    {action.description && (
                        <Text color="dimmed" size="xs" lineClamp={1}>
                            {action.description}
                        </Text>
                    )}
                </div>

                {action.new && <Badge>new</Badge>}
            </Group>
        </UnstyledButton>
    );
}

export default SearchLayout;
