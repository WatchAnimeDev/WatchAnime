import React, { useState } from "react";

import { Paper, TextInput, PasswordInput, Checkbox, Button, Text, Anchor } from "@mantine/core";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { useNavigate } from "react-router-dom";
import { signIn } from "../custom/Auth";

function SignInLayout() {
    const navigate = useNavigate();

    const [hasSignInStarted, setHasSignInStarted] = useState(false);
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const executeSignIn = async () => {
        setHasSignInStarted(true);
        if (!userName || !password) {
            setError("Please enter both username and password");
            setHasSignInStarted(false);
            return;
        }
        const signInSuccess = await signIn(userName, password);
        if (!signInSuccess) {
            setError("Invalid username or password");
            setHasSignInStarted(false);
        } else {
            navigate("/");
        }
    };

    return (
        <>
            {error ? (
                <Paper sx={{ backgroundColor: "rgb(216,157,49)", opacity: "1" }} mb="md">
                    <Paper sx={{ backgroundColor: "transparent" }} p={10}>
                        <Text size="md" color="black">
                            {error}
                        </Text>
                    </Paper>
                </Paper>
            ) : (
                <></>
            )}
            <TextInput label="Username" placeholder="cool_guy69" size="md" onChange={(e) => setUserName(e.target.value)} />
            <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" onChange={(e) => setPassword(e.target.value)} />
            <Paper sx={{ backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "space-between" }} mt="xl">
                <Checkbox label="Keep me logged in" size="md" />
                <Anchor href="#" fw={700} onClick={() => navigate("/reset")} sx={{ color: WATCHANIME_RED }}>
                    Forgot Password
                </Anchor>
            </Paper>

            <Button fullWidth mt="xl" size="md" sx={{ backgroundColor: WATCHANIME_RED }} onClick={executeSignIn} loading={hasSignInStarted}>
                Login
            </Button>

            <Text ta="center" mt="md">
                Don&apos;t have an account?{" "}
                <Anchor href="#" fw={700} onClick={() => navigate("/signup")} sx={{ color: WATCHANIME_RED }}>
                    Register
                </Anchor>
            </Text>
        </>
    );
}

export default SignInLayout;
