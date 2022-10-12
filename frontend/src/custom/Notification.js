import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";

const showGenericCheckBoxNotification = (title, message) => {
    showNotification({
        title: title,
        message: message,
        autoClose: 5000,
        icon: <IconCheck size={16} />,
        color: "teal",
    });
};

export { showGenericCheckBoxNotification };
