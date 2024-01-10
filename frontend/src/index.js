import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: "dark", fontFamily: "'Schibsted Grotesk', sans-serif" }}>
        <NotificationsProvider>
            <ModalsProvider>
                <Router>
                    <App />
                </Router>
            </ModalsProvider>
        </NotificationsProvider>
    </MantineProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
