import { Box, Modal, Progress, Text } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import React from "react";

function AnimeCloudSyncComponent({ cloudSyncModalOpen, cloudSyncPersentage, cloudSyncModalText }) {
    return (
        <Modal opened={cloudSyncModalOpen} onClose={closeAllModals} title="Cloud Sync" centered={true} closeOnClickOutside={false} closeOnEscape={false} withCloseButton={false}>
            <Box sx={{ textAlign: "center" }}>
                <Progress value={cloudSyncPersentage} label={`${cloudSyncPersentage}%`} size="xl" radius="md" animate color={cloudSyncPersentage < 100 ? "blue" : "green"} />
                <Text mt="md" size="sm">
                    {cloudSyncModalText}
                </Text>
            </Box>
        </Modal>
    );
}

export default AnimeCloudSyncComponent;
