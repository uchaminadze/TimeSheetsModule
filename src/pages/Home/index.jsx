import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import TimeSheetTable from '../../components/TimeSheetTable';


function Home({instance, accounts}) { 
    return (
        <div>
            <AuthenticatedTemplate>
                <TimeSheetTable instance={instance} accounts={accounts}/>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5>Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};



export default Home