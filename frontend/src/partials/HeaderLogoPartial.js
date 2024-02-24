import { Image } from "@mantine/core";
import React from "react";

function HeaderLogoPartial({ isChristmasEnabled, mobile }) {
    return (
        <Image
            src={
                isChristmasEnabled
                    ? "https://d33wubrfki0l68.cloudfront.net/9410fce5c5c19ee15bf2b5e4872391aad38a6981/8f410/assets/logo/watchanime-logo-w-christ.png"
                    : "https://d33wubrfki0l68.cloudfront.net/b0992c861afa31cd31c0d25e095ac1ed87aa4f5a/c411d/assets/logo/watchanime-logo-w.png"
            }
            width={mobile ? 150 : 200}
        />
    );
}

export default HeaderLogoPartial;
