import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@team-forge/shared/ui';

export const DashboardLayout = () => {
    const { tokens } = useTheme();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background-default)' }}>
            <Sidebar />
            <div style={{
                marginLeft: '260px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0
            }}>
                <Topbar />
                <main style={{
                    flex: 1,
                    padding: tokens.spacing(6),
                    overflowY: 'auto'
                }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
