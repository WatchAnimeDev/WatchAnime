import { Button, Group, Image, Input, Paper, Text, Textarea } from "@mantine/core";
import React, { useRef, useState } from "react";
import { getUserAvatar } from "../custom/User";
import { IconAt, IconCalendarEvent, IconKeyFilled, IconPassword, IconPencil, IconRosetteDiscountCheckFilled, IconUserCheck, IconX } from "@tabler/icons-react";
import { pocketBaseInstance, userData } from "../custom/Auth";
import { WATCHANIME_RED } from "../constants/cssConstants";
import { showGenericCheckBoxNotification } from "../custom/Notification";

function DashboardProfileLayout() {
    const pbUserData = userData().model;

    const [image, setImage] = useState(getUserAvatar());
    const [isPasswordReserExpanded, setIsPasswordReserExpanded] = useState(false);
    const [userEmail, setUserEmail] = useState(pbUserData.email);
    const [userDisplayName, setUserDisplayName] = useState(pbUserData.name);
    const [userCurrentPassword, setUserCurrentPassword] = useState("");
    const [userNewPassword, setUserNewPassword] = useState("");
    const [userNewPasswordConfirm, setUserNewPasswordConfirm] = useState("");
    const [userBio, setUserBio] = useState(pbUserData.bio);
    const imagePickerRef = useRef(null);

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const onProfileSubmit = async () => {
        const postData = new FormData();
        const pb = pocketBaseInstance();
        let hasChange = false;
        // use regex to validate email
        if (userEmail !== pbUserData.email) {
            // eslint-disable-next-line
            if (!userEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                showGenericCheckBoxNotification("Invalid Email", "Please enter a valid email", {
                    color: "red",
                    icon: <IconX size={16} />,
                });
                return;
            } else {
                await pb.collection("users").requestEmailChange(userEmail);
                showGenericCheckBoxNotification("Email Update Request Sent", "We have sent you an email to your email id. Please follow the steps in email to update your email", {
                    color: "green",
                    icon: <IconUserCheck size={16} />,
                });
            }
        }

        if (userDisplayName !== pbUserData.name) {
            if (userDisplayName.length < 3) {
                showGenericCheckBoxNotification("Invalid Name", "Names must have a minimum of 3 characters", {
                    color: "red",
                    icon: <IconX size={16} />,
                });
                return;
            } else {
                postData.append("name", userDisplayName);
                hasChange = true;
            }
        }

        if ((userCurrentPassword || userNewPassword || userNewPasswordConfirm) && userCurrentPassword !== "" && userNewPassword !== "" && userNewPasswordConfirm !== "") {
            if (userNewPassword !== userNewPasswordConfirm) {
                showGenericCheckBoxNotification("Invalid Password", "New and Confirm Passwords do not match", {
                    color: "red",
                    icon: <IconX size={16} />,
                });
                return;
            } else {
                postData.append("oldPassword", userCurrentPassword);
                postData.append("password", userNewPassword);
                postData.append("passwordConfirm", userNewPasswordConfirm);
                hasChange = true;
            }
        } else {
            if (userCurrentPassword || userNewPassword || userNewPasswordConfirm) {
                showGenericCheckBoxNotification("Invalid Password", "Must specifiy current and new password", {
                    color: "red",
                    icon: <IconX size={16} />,
                });
                return;
            }
        }

        if (userBio !== pbUserData.bio) {
            postData.append("bio", userBio);
            hasChange = true;
        }

        if (imagePickerRef.current.files[0]) {
            postData.append("avatar", imagePickerRef.current.files[0]);
            hasChange = true;
        }
        if (hasChange) {
            await pb.collection("users").update(pbUserData.id, postData);
            showGenericCheckBoxNotification("Profile Updated", "Your profile has been updated", {
                color: "green",
                icon: <IconUserCheck size={16} />,
            });
        }
        return;
    };

    return (
        <Group w={"100%"} h={"100%"} sx={{ justifyContent: "center" }}>
            <Group sx={{ maxWidth: "500px", width: "100%", flexDirection: "column", gap: "30px" }} px={"25px"} py={"60px"} bg={"#25262b"}>
                <Group sx={{ position: "relative", cursor: "pointer" }}>
                    <Image radius="50%" src={image} width={"100px"} height={"100px"} className="profile-image" />
                    <Paper
                        sx={{ position: "absolute", bottom: "0", right: "0", width: "30px", height: "30px", textAlign: "center", lineHeight: "34px", borderRadius: "50%", zIndex: "9", background: "#25262b" }}
                        onClick={() => imagePickerRef.current.click()}
                    >
                        <IconPencil size={16} />
                        <input type="file" onChange={onImageChange} className="filetype" style={{ display: "none" }} ref={imagePickerRef} accept="image/png, image/gif, image/jpeg" />
                    </Paper>
                </Group>
                <Group sx={{ gap: "3px" }}>
                    <Text size={"md"}>Hi, {pbUserData.username}</Text>
                    {pbUserData.verified && <IconRosetteDiscountCheckFilled size={16} color="rgb(29, 155, 240)" />}
                </Group>
                <Group sx={{ flexDirection: "column" }} w={"100%"}>
                    <Input.Wrapper label="Email" w={"100%"}>
                        <Input icon={<IconAt size={16} />} value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                    </Input.Wrapper>
                    <Input.Wrapper label="Display Name" w={"100%"}>
                        <Input icon={<IconUserCheck size={16} />} value={userDisplayName} onChange={(e) => setUserDisplayName(e.target.value)} />
                    </Input.Wrapper>
                    <Input.Wrapper label="Joined" w={"100%"}>
                        <Input icon={<IconCalendarEvent size={16} />} value={pbUserData.created.split(" ")[0]} disabled readOnly />
                    </Input.Wrapper>
                    <Input.Wrapper label="Bio" w={"100%"}>
                        <Textarea value={userBio} onChange={(e) => setUserBio(e.currentTarget.value)} />
                    </Input.Wrapper>
                </Group>
                <Group w={"100%"} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <Group sx={{ gap: "4px", "&:hover": { color: "white" }, cursor: "pointer" }} onClick={() => setIsPasswordReserExpanded(!isPasswordReserExpanded)}>
                        <IconKeyFilled size={16} />
                        <Text>Change Password</Text>
                    </Group>

                    {isPasswordReserExpanded && (
                        <>
                            <Input.Wrapper label="Current Password" w={"100%"}>
                                <Input icon={<IconPassword size={16} />} type="password" onChange={(e) => setUserCurrentPassword(e.target.value)} />
                            </Input.Wrapper>
                            <Input.Wrapper label="New Password" w={"100%"}>
                                <Input icon={<IconPassword size={16} />} type="password" onChange={(e) => setUserNewPassword(e.target.value)} />
                            </Input.Wrapper>
                            <Input.Wrapper label="Confirm New Password" w={"100%"}>
                                <Input icon={<IconPassword size={16} />} type="text" onChange={(e) => setUserNewPasswordConfirm(e.target.value)} />
                            </Input.Wrapper>
                        </>
                    )}
                </Group>
                <Button
                    sx={{
                        backgroundColor: WATCHANIME_RED,
                        width: "100px ",
                        ":hover": {
                            backgroundColor: WATCHANIME_RED,
                        },
                    }}
                    w={"100%"}
                    onClick={onProfileSubmit}
                >
                    Submit
                </Button>
            </Group>
        </Group>
    );
}

export default DashboardProfileLayout;
