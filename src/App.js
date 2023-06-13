import './App.css'
import React from 'react';
import { PageLayout } from './components/PageLayout';
import { useMsal } from '@azure/msal-react';
import Home from './pages/Home';

export default function App() {
    const { instance, accounts } = useMsal();

    return (
        <PageLayout>
            <Home instance={instance} accounts={accounts}/>
        </PageLayout>
    );
}
