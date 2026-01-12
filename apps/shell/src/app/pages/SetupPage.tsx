import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@team-forge/shared/ui';

export const SetupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/setup', { email, password, orgName });
            localStorage.setItem('token', res.data.access_token);
            navigate('/');
            window.location.reload(); // Force reload to re-run guard checks
        } catch (err: any) {
            setError(err.response?.data?.message || 'Setup failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>Welcome to Team Forge</h1>
            <p>Setup your Organization</p>

            <form onSubmit={handleSetup}>
                <Input
                    label="Organization Name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Acme Corp"
                />
                <Input
                    label="Admin Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <Button type="submit" style={{ width: '100%' }}>Complete Setup</Button>
            </form>
        </div>
    );
};

export default SetupPage;
