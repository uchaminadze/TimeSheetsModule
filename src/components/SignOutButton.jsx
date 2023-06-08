import React from "react";
import { useMsal } from "@azure/msal-react";

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
        localStorage.clear()
    }

    
    return (
        <button as="button" onClick={() => handleLogout()}>Sign out</button>
    )
}