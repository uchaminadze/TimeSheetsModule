import './App.css'
import React from 'react';
import { PageLayout } from './components/PageLayout';
import { useMsal } from '@azure/msal-react';
import Home from './pages/Home';
import useStore from './store/useStore';
import { useEffect } from 'react';

export default function App() {
    const { instance, accounts } = useMsal();
    const {setWeekStartDate} = useStore();

    useEffect(() => {
        setWeekStartDate("2023-01-08T05:00:00Z")
    }, [])


    return (
        <PageLayout>
            <Home instance={instance} accounts={accounts}/>
        </PageLayout>
    );
}
