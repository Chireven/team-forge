import React, { useState } from 'react';
import { Button, tokens } from '@team-forge/shared/ui';
import { UserSelect } from '../user-select/user-select';
import { AddTeamMemberRequest } from '@team-forge/shared/data-access';

interface AddMemberDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: AddTeamMemberRequest) => void;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ isOpen, onClose, onAdd }) => {
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState<'LEAD' | 'MEMBER'>('MEMBER');
    const [allocation, setAllocation] = useState(100);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!userId) return;
        onAdd({ userId, role, allocationPercent: Number(allocation) });
        // Reset form
        setUserId('');
        setRole('MEMBER');
        setAllocation(100);
    };

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: tokens.zIndex.modal,
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--background-paper)',
        padding: tokens.spacing(6),
        borderRadius: tokens.spacing(2),
        width: '400px',
        maxWidth: '90%',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing(4),
    };

    const labelStyle = {
        display: 'block',
        marginBottom: tokens.spacing(1),
        fontWeight: 500,
        color: 'var(--text-secondary)',
    };

    const selectStyle = {
        width: '100%',
        padding: tokens.spacing(2),
        borderRadius: tokens.spacing(1),
        border: '1px solid var(--border)',
        backgroundColor: 'var(--background-paper)',
        color: 'var(--text-primary)',
        fontSize: '1rem',
    };

    return (
        <div style={overlayStyle}>
            <div style={cardStyle}>
                <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Add Team Member</h2>
                
                <div>
                    <label style={labelStyle}>User</label>
                    <UserSelect value={userId} onChange={setUserId} />
                </div>

                <div>
                    <label style={labelStyle}>Role</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value as 'LEAD' | 'MEMBER')}
                        style={selectStyle}
                    >
                        <option value="MEMBER">Member</option>
                        <option value="LEAD">Lead</option>
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>Allocation ({allocation}%)</label>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={allocation} 
                        onChange={(e) => setAllocation(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: tokens.spacing(2), marginTop: tokens.spacing(2) }}>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!userId}>Add Member</Button>
                </div>
            </div>
        </div>
    );
};
