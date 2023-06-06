import React, { useState } from 'react';
import { PageLayout } from './components/PageLayout';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { baseUrl, loginRequest } from './authConfig';
import { callMsGraph } from './graph';
import { ProfileData } from './components/ProfileData';
import { callDataverseWebAPI } from './dataverse';
import { useEffect } from 'react';

const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);  
    const [dataverseData, setDataverseData] = useState(null);


    useEffect(() => {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });

        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
                scopes: [baseUrl+"/.default"]
            })
            .then((response) => {
                console.log(accounts)
                callDataverseWebAPI("WhoAmI", response.accessToken).then((response) => setDataverseData(response));
            });
    }, [])

    return (
        <>
            <h5>Welcome {accounts[0].name}</h5>
            {graphData && <ProfileData graphData={graphData} />}
        </>
    );
};


const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5>Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}
