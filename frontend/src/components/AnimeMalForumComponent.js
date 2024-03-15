import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/genricConstants";
import axios from "axios";
import TableComponent from "./TableComponent";
import { Anchor, Box, Group, Paper, Text } from "@mantine/core";

function AnimeMalForumComponent({ malId }) {
    const [ajaxComplete, setAjaxComplete] = useState(false);
    const [forumData, setForumData] = useState([]);

    useEffect(() => {
        async function getForumData() {
            setAjaxComplete(false);
            const [forumData] = await Promise.all([axios.get(`${API_BASE_URL}/anime/malforum/${malId}`)]);
            setForumData(forumData.data);
            setAjaxComplete(true);
            return;
        }
        getForumData();
    }, [malId]);

    return ajaxComplete ? (
        <Group sx={{ width: "100%", marginBottom: "30px" }}>
            <Group sx={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
                <Paper sx={{ backgroundColor: "transparent", display: "flex", alignItems: "center" }}>
                    <Text sx={{ fontSize: "20px", fontWeight: "700", marginRight: "5px" }}>Latest Discussion</Text>
                </Paper>
            </Group>
            <TableComponent
                data={{
                    header: {
                        data: [
                            { name: "Topics", value: "title" },
                            { name: "Replies", value: "comments" },
                            { name: "Last Post", value: "last_comment" },
                        ],
                        render: (title) => {
                            return title.name;
                        },
                    },
                    body: {
                        data: forumData,
                        render: (post) => {
                            return (
                                <>
                                    <td>
                                        <Box>
                                            <Anchor href={post.url} target="_blank">
                                                <Box sx={{ color: "white" }}>{post.title}</Box>
                                            </Anchor>
                                            <Anchor href={post.author_url} target="_blank">
                                                <Box sx={{ color: "grey" }}>{post.author_username}</Box>
                                            </Anchor>
                                        </Box>
                                    </td>
                                    <td>{post.comments}</td>
                                    <td>
                                        by{" "}
                                        <Anchor href={post.last_comment.author_url} target="_blank">
                                            {post.last_comment.author_username}
                                        </Anchor>
                                    </td>
                                </>
                            );
                        },
                    },
                    id: "forum-table",
                }}
                tableOptions={{ withBorder: true, striped: true }}
            />
        </Group>
    ) : (
        <></>
    );
}

export default AnimeMalForumComponent;
