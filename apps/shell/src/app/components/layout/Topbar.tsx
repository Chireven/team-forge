import React, { useEffect } from 'react';
import { useTheme, Button, useToast } from '@team-forge/shared/ui';
import { eventBus } from '@team-forge/shared/utils';
import { Restricted } from '@team-forge/shared/auth-client';
import { useNavigate } from 'react-router-dom';

export const Topbar = () => {
    const { mode, toggleTheme, tokens } = useTheme();
    const { toast } = useToast();
    const navigate = useNavigate();

    // DEBUG: Listen to all events
    useEffect(() => {
        const sub = eventBus.asObservable().subscribe(envelope => {
            console.log('[SHELL EVENT BUS]', envelope);
        });
        return () => sub.unsubscribe();
    }, []);

    const handleTestParams = () => {
        eventBus.emit('TEST:CLICKED', { message: 'Hello World' }, 'Shell');
        toast('Event Emitted! Check Console.', 'success');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload(); // Hard reload to clear state
    };

    return (
        <header style={{
            height: '64px',
            backgroundColor: 'var(--background-paper)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${tokens.spacing(6)}`,
            position: 'sticky',
            top: 0,
            zIndex: tokens.zIndex.appBar
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Breadcrumbs Placeholder */}
                <span style={{ color: 'var(--text-secondary)' }}>Dashboard</span>

                {/* VERIFICATION BUTTON */}
                <Restricted to="test.permission">
                    <Button onClick={handleTestParams} variant="secondary">
                        Test Event Bus
                    </Button>
                </Restricted>

                {/* This should be hidden */}
                <Restricted to="secret.admin">
                    <Button onClick={() => { }} variant="primary">
                        HIDDEN BUTTON
                    </Button>
                </Restricted>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing(4) }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-primary)'
                    }}
                >
                    {mode === 'light' ? '🌙' : '☀️'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing(2) }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-main)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        A
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};
