import { Table } from "@mantine/core";
import React from "react";

function TableComponent({ data, tableOptions }) {
    return (
        <Table {...tableOptions}>
            <thead>
                <tr>
                    {data.header.data.map((row, ind) => (
                        <th key={`${data.id}-${ind}`}>{data.header.render(row)}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.body.data.map((post, ind) => (
                    <tr key={`${data.id}-${ind}`}>{data.body.render(post)}</tr>
                ))}
            </tbody>
        </Table>
    );
}

export default TableComponent;
