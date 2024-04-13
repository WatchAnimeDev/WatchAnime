import PocketBase from "pocketbase";
import { AUTH_BASE_URL } from "../constants/genricConstants";
import { getOrSetUid } from "./User";

const isAuthPath = (path = null) => {
    if (!path) {
        path = window.location.pathname;
    }
    const regex = /^(\/signin|\/signup|\/reset)$/;
    return regex.test(path);
};

const pocketBaseInstance = () => {
    return new PocketBase(AUTH_BASE_URL);
};

const signIn = async (username, password) => {
    const pb = pocketBaseInstance();
    try {
        await pb.collection("users").authWithPassword(username, password);
        return true;
    } catch (e) {
        return false;
    }
};

const signUp = async (username, email, password, inviteCode) => {
    const pb = pocketBaseInstance();
    try {
        const userData = {
            username: username,
            email: email,
            emailVisibility: false,
            password: password,
            passwordConfirm: password,
            name: username,
            anon_uid: getOrSetUid(),
            roles: "member",
            invite_code: inviteCode,
        };
        await pb.collection("users").create(userData);
        await signIn(username, password);
        return { success: true, err: {} };
    } catch (e) {
        return { success: false, err: e.data.data };
    }
};

const refreshLogin = async () => {
    const pb = pocketBaseInstance();
    try {
        await pb.collection("users").authRefresh();
        return true;
    } catch (e) {
        return false;
    }
};

const resetPassword = async (email) => {
    const pb = pocketBaseInstance();
    try {
        await pb.collection("users").requestPasswordReset(email);
        return true;
    } catch (e) {
        return false;
    }
};

const userData = () => {
    const pb = pocketBaseInstance();
    return pb.authStore;
};

const signOut = async () => {
    const pb = pocketBaseInstance();
    pb.authStore.clear();
};

const preprocessAuthErrors = (err) => {
    for (const errKey in err) {
        if (errKey === "invite_code")
            if (err[errKey].code === "validation_not_unique") {
                err[errKey].message = "The invite code has already been used";
            } else if (err[errKey].code === "validation_missing_rel_records") {
                err[errKey].message = "The invite code is invalid. Join our discord from the link below to get an invite code!";
            }
    }
    return err;
};

const getUidForLoggedInUser = () => {
    return userData().model.anon_uid;
};

export { signIn, signUp, refreshLogin, userData, signOut, preprocessAuthErrors, isAuthPath, resetPassword, getUidForLoggedInUser };
