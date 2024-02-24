import React, { useState } from "react";

import { Paper, TextInput, PasswordInput, Button, Text, Anchor, List } from "@mantine/core";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { useNavigate } from "react-router-dom";
import { preprocessAuthErrors, signUp } from "../custom/Auth";

function SignUpLayout() {
    const navigate = useNavigate();

    const [hasSignUpStarted, setHasSignUpStarted] = useState(false);
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [inviteCode, setInviteCode] = useState();
    const [error, setError] = useState({});

    const executeSignUp = async () => {
        setHasSignUpStarted(true);
        if (!userName || !password || !email || !inviteCode) {
            setError({ err: { message: "Please enter all fields" } });
            setHasSignUpStarted(false);
            return;
        }
        const { success, err } = await signUp(userName, email, password, inviteCode);
        if (!success) {
            setError(preprocessAuthErrors(err));
            setHasSignUpStarted(false);
        } else {
            navigate("/");
        }
    };

    return (
        <>
            {Object.keys(error).length ? (
                <Paper sx={{ backgroundColor: "rgb(216,157,49)", opacity: "1" }} mb="md">
                    <Paper sx={{ backgroundColor: "transparent" }} p={10}>
                        <Text color="black"> Following errors occured while processing:</Text>
                        <List ml={20}>
                            {Object.keys(error).map((err) => {
                                return (
                                    <List.Item sx={{ color: "black" }} key={err}>
                                        {error[err].message}
                                    </List.Item>
                                );
                            })}
                        </List>
                    </Paper>
                </Paper>
            ) : (
                <></>
            )}
            <TextInput label="Username" placeholder="cooluser42" size="md" required onChange={(e) => setUserName(e.target.value)} />
            <TextInput label="Email address" placeholder="hello@gmail.com" size="md" mt="md" required onChange={(e) => setEmail(e.target.value)} />
            <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" required onChange={(e) => setPassword(e.target.value)} />
            <TextInput label="Invite code" size="md" mt="md" required onChange={(e) => setInviteCode(e.target.value)} />
            <Button fullWidth mt="xl" size="md" sx={{ backgroundColor: WATCHANIME_RED }} loading={hasSignUpStarted} onClick={executeSignUp}>
                Register
            </Button>

            <Text ta="center" mt="md">
                Already have an account?{" "}
                <Anchor href="#" fw={700} onClick={() => navigate("/signin")} sx={{ color: WATCHANIME_RED }}>
                    Login
                </Anchor>
            </Text>

            <Paper sx={{ backgroundColor: "transparent" }}>
                <Text ta="center" mt="xl" p="md" sx={{ backgroundColor: "rgb(53, 55, 56)" }} color="white">
                    Need an invite code? Join us on our discord from the link below.
                </Text>
            </Paper>
        </>
    );
}

export default SignUpLayout;
