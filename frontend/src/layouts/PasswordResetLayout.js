import { Anchor, Button, Paper, Text, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { resetPassword } from "../custom/Auth";

function PasswordResetLayout() {
    const navigate = useNavigate();

    const [hasPasswordResetStarted, setHasPasswordResetStarted] = useState(false);
    const [email, setEmail] = useState();
    const [status, setStatus] = useState();
    const [requestSuccess, setRequestSuccess] = useState(false);

    const executePasswordReset = async () => {
        setHasPasswordResetStarted(true);
        if (!email) {
            setStatus("Please enter an email address");
            setHasPasswordResetStarted(false);
            setRequestSuccess(false);
            return;
        }

        const passwordResetSuccess = await resetPassword(email);
        if (!passwordResetSuccess) {
            setStatus("An error occurred. Please try again later.");
            setHasPasswordResetStarted(false);
            setRequestSuccess(false);
        } else {
            setStatus("Password reset email sent. Please check your inbox. Redirecting to login page in 3seconds...");
            setHasPasswordResetStarted(false);
            setRequestSuccess(true);
            setTimeout(() => {
                navigate("/signin");
            }, 3000);
        }
    };

    return (
        <>
            {status ? (
                <Paper sx={{ backgroundColor: requestSuccess ? "green" : "rgb(216,157,49)", opacity: "1" }} mb="md">
                    <Paper sx={{ backgroundColor: "transparent" }} p={10}>
                        <Text size="md" color={requestSuccess ? "white" : "black"}>
                            {status}
                        </Text>
                    </Paper>
                </Paper>
            ) : (
                <></>
            )}
            <TextInput label="Email address" placeholder="hello@gmail.com" size="md" onChange={(e) => setEmail(e.target.value)} />

            <Button fullWidth mt="xl" size="md" sx={{ backgroundColor: WATCHANIME_RED }} loading={hasPasswordResetStarted} onClick={executePasswordReset}>
                Reset
            </Button>

            <Text ta="center" mt="md">
                Remember your password?{" "}
                <Anchor href="#" fw={700} onClick={() => navigate("/signin")} sx={{ color: WATCHANIME_RED }}>
                    Login
                </Anchor>
            </Text>
        </>
    );
}

export default PasswordResetLayout;
