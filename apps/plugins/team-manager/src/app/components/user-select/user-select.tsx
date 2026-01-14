import React, { useEffect, useState } from 'react';
import { teamsApi } from '../../api';
import { tokens } from '@team-forge/shared/ui';

interface UserSelectProps {
    value: string;
    onChange: (userId: string) => void;
}

export const UserSelect: React.FC<UserSelectProps> = ({ value, onChange }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        teamsApi.listUsers()
            .then((data) => {
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load users', err);
                setLoading(false);
            });
    }, []);

    const style = {
        width: '100%',
        padding: tokens.spacing(2),
        borderRadius: tokens.spacing(1),
        border: '1px solid var(--border)',
        backgroundColor: 'var(--background-paper)',
        color: 'var(--text-primary)',
        fontSize: '1rem',
    };

    return (
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            style={style}
            disabled={loading}
        >
            <option value="">Select a user...</option>
            {users.map((user) => (
                <option key={user.id} value={user.id}>
                    {user.email}
                </option>
            ))}
        </select>
    );
};
