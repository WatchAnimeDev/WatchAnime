import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Checkbox, Button, Group, Box, Container, Textarea, LoadingOverlay, Alert } from "@mantine/core";
import SideBarComponent from "../components/SideBarComponent";
import { API_BASE_URL } from "../constants/genricConstants";
import axios from "axios";

function ContactScreen({ sideBarState, setSideBarState, bugReportState, setBugReportState }) {
    const [visible, setVisible] = useState(false);

    const [formSuccess, setFormSuccess] = useState(false);
    const [formError, setFormError] = useState(false);

    const sideBarComponentConfigForSideBarMenu = {
        title: "Menu",
        type: "SideBarMenuLayout",
        data: [{ label: "Home", href: "/" }, { label: "Random" }],
    };

    const handleContactFormSubmit = async (formData) => {
        setVisible(true);

        try {
            await Promise.all([axios.post(`${API_BASE_URL}/reporting/contact?name=${formData.name}&email=${formData.email}&message=${formData.message}`)]);
            setFormSuccess(true);
        } catch (e) {
            setFormError(true);
        } finally {
            setVisible(false);
        }
    };
    const form = useForm({
        initialValues: {
            email: "",
            termsOfService: false,
            name: "",
            message: "",
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            name: (value) => (value.length >= 3 ? null : "Please enter name of atleast 3 characters"),
            message: (value) => (value.length >= 20 ? null : "Please enter message of atleast 20 characters"),
            termsOfService: (value) => (value === true ? null : "Please accept tos"),
        },
        validateInputOnChange: true,
    });

    return (
        <>
            <SideBarComponent sideBarState={sideBarState} setSideBarState={setSideBarState} sideBarComponentConfig={sideBarComponentConfigForSideBarMenu} otherData={{ bugReportState, setBugReportState }} />
            <Container sx={{ marginTop: "80px", backgroundColor: "rgb(37, 38, 43)", padding: "20px" }}>
                <Box mx="auto">
                    <LoadingOverlay visible={visible} overlayBlur={2} />
                    <form onSubmit={form.onSubmit((values) => handleContactFormSubmit(values))}>
                        <TextInput sx={{ marginBottom: "10px" }} label="Name" placeholder="Chad Brotato" {...form.getInputProps("name")} />
                        <TextInput sx={{ marginBottom: "10px" }} label="Email" placeholder="your@email.com" {...form.getInputProps("email")} />
                        <Textarea sx={{ marginBottom: "10px" }} label="Message" placeholder="Your message goes here!" {...form.getInputProps("message")} />
                        <Checkbox sx={{ marginBottom: "10px" }} mt="md" label="I agree to sell my privacy" {...form.getInputProps("termsOfService", { type: "checkbox" })} />
                        <Group position="right" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                        {formSuccess && (
                            <Alert title="Wohoo!" color="green" radius="xs" sx={{ marginTop: "20px" }}>
                                {`We have recived your message!. Expect a reply from us within 5-7 days.`}
                            </Alert>
                        )}
                        {formError && (
                            <Alert title="Bummmer!" color="red" radius="xs" sx={{ marginTop: "20px" }}>
                                {`We couldn't send your queries to our servers!`}
                            </Alert>
                        )}
                    </form>
                </Box>
            </Container>
        </>
    );
}

export default ContactScreen;
