import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamsApi } from '../../api';
import { Button, tokens } from '@team-forge/shared/ui';
import { AddMemberDialog } from '../../components/add-member-dialog/add-member-dialog';

export const TeamDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [team, setTeam] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]); // Detailed members
    const [loading, setLoading] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'MEMBERS' | 'PROJECTS' | 'SETTINGS'>('MEMBERS');

    useEffect(() => {
        loadTeam();
        if (activeTab === 'MEMBERS') {
            loadMembers();
        }
    }, [id, activeTab]);

    const loadTeam = () => {
        if (!id) return;
        setLoading(true);
        teamsApi.getTeam(id)
            .then(setTeam)
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const loadMembers = () => {
        if (!id) return;
        teamsApi.getMembers(id)
            .then(setMembers)
            .catch(err => console.error('Failed to load members', err));
    };

    const handleAddMember = async (data: any) => {
        if (!id) return;
        try {
            await teamsApi.addMember(id, data);
            setIsAddMemberOpen(false);
            loadMembers(); // Refresh members list
        } catch (error) {
            console.error('Failed to add member', error);
            alert('Failed to add member');
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!id) return;
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        try {
            await teamsApi.removeMember(id, userId);
            loadMembers();
        } catch (error) {
            console.error('Failed to remove member', error);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!team) return <div>Team not found</div>;

    const headerStyle = {
        marginBottom: tokens.spacing(4),
        borderBottom: '1px solid var(--border)',
        paddingBottom: tokens.spacing(2),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const tabStyle = (isActive: boolean) => ({
        padding: '8px 16px',
        borderBottom: isActive ? '2px solid var(--primary-main)' : 'none',
        color: isActive ? 'var(--primary-main)' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontWeight: isActive ? 600 : 400,
    });

    return (
        <div style={{ padding: tokens.spacing(4) }}>
            <div style={headerStyle}>
                <div>
                    <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>{team.name}</h1>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{team.description}</p>
                </div>
                <div style={{ display: 'flex', gap: tokens.spacing(2) }}>
                    <Button variant="secondary" onClick={() => navigate('/')}>Back</Button>
                </div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: tokens.spacing(4) }}>
                <div style={tabStyle(activeTab === 'MEMBERS')} onClick={() => setActiveTab('MEMBERS')}>Members</div>
                <div style={tabStyle(activeTab === 'PROJECTS')} onClick={() => setActiveTab('PROJECTS')}>Projects</div>
                <div style={tabStyle(activeTab === 'SETTINGS')} onClick={() => setActiveTab('SETTINGS')}>Settings</div>
            </div>

            {activeTab === 'MEMBERS' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: tokens.spacing(2) }}>
                        <Button onClick={() => setIsAddMemberOpen(true)}>Add Member</Button>
                    </div>
                    {members.length ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {members.map((m: any) => (
                                <li key={m.id} style={{ 
                                    padding: tokens.spacing(2), 
                                    borderBottom: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    color: 'var(--text-primary)'
                                }}>
                                    <div>
                                        <strong>{m.user?.email || 'Unknown User'}</strong>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {m.role} • {m.allocationPercent}% Allocated
                                        </div>
                                    </div>
                                    <Button variant="secondary" onClick={() => handleRemoveMember((m as any).userId)}>
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No members found.</p>
                    )}
                </div>
            )}

            <AddMemberDialog 
                isOpen={isAddMemberOpen} 
                onClose={() => setIsAddMemberOpen(false)} 
                onAdd={handleAddMember}
            />
        </div>
    );
};
