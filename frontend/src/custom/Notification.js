import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";

const showGenericCheckBoxNotification = (title, message, config) => {
    showNotification({
        ...{
            title: title,
            message: message,
            autoClose: 5000,
            icon: <IconCheck size={16} />,
            color: "teal",
        },
        ...config,
    });
};

const showGenericDynamicNotification = (id, title, message, config = {}) => {
    showNotification({
        ...{
            id: id,
            loading: true,
            title: title,
            message: message,
            autoClose: false,
            disallowClose: true,
        },
        ...config,
    });
};

const dismissGenericDynamicNotification = (id, title, message, config = {}) => {
    updateNotification({
        ...{
            id: id,
            title: title,
            message: message,
            autoClose: 5000,
            icon: <IconCheck size={16} />,
            color: "teal",
        },
        ...config,
    });
};

export { showGenericCheckBoxNotification, showGenericDynamicNotification, dismissGenericDynamicNotification };
