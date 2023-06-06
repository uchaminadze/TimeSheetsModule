import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import ProfileContent from '../../components/ProfileContent';


function Home({instance, accounts}) { 
    return (
        <div>
            <AuthenticatedTemplate>
                <ProfileContent instance={instance} accounts={accounts}/>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5>Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};



export default Home