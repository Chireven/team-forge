import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '../../api';

export const TeamListPage: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: teams, isLoading } = useQuery({ queryKey: ['teams'], queryFn: teamsApi.listTeams });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', description: '' });

    const createMutation = useMutation({
        mutationFn: teamsApi.createTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            setShowCreateModal(false);
            setNewTeam({ name: '', description: '' });
        },
    });

    if (isLoading) return <div>Loading teams...</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Teams</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Create Team
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams?.map((team: any) => (
                    <div
                        key={team.id}
                        className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer"
                        style={{ backgroundColor: 'var(--background-paper)', borderColor: 'var(--border)' }}
                        onClick={() => navigate(team.id)}
                    >
                        <div className="flex justify-between items-start">
                             <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
                             {/* Optional: Add Manage button if explicit action preferred */}
                        </div>
                        <p className="text-gray-600 mb-4">{team.description || 'No description'}</p>
                        <div className="text-sm text-gray-500">
                            Members: {team.memberCount || 0}
                        </div>
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Team</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newTeam.name}
                                    onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Team name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={newTeam.description}
                                    onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Description (optional)"
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => createMutation.mutate(newTeam)}
                                    disabled={!newTeam.name}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
