/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from 'react';

import { useIsAuthenticated } from '@azure/msal-react';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
            <nav>
                <a href="/">
                    Microsoft Identity Platform
                </a>
                <div>
                    {isAuthenticated ? <SignOutButton /> : <SignInButton />}
                </div>
            </nav>
            <h5>
                Welcome to the Microsoft Authentication Library For Javascript - React Quickstart
            </h5>
            <br />
            <br />
            {props.children}
        </>
    );
};