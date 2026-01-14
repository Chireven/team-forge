import axios from 'axios';
import { TeamMember, AddTeamMemberRequest } from '@team-forge/shared/data-access';

const api = axios.create({
    baseURL: '/api',
});

// Interceptor to add auth token if needed (assuming shared auth logic handles this globally,
// but adding placeholder just in case)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const teamsApi = {
    listTeams: () => api.get('/teams').then(res => res.data.data || res.data),
    getTeam: (id: string) => api.get(`/teams/${id}`).then(res => res.data.data || res.data),
    getMembers: (id: string): Promise<TeamMember[]> => api.get(`/teams/${id}/members`).then(res => res.data.data || res.data),
    createTeam: (data: { name: string; description?: string }) => api.post('/teams', data).then(res => res.data.data || res.data),
    addMember: (teamId: string, payload: AddTeamMemberRequest): Promise<TeamMember> =>
        api.post(`/teams/${teamId}/members`, payload).then(res => res.data.data || res.data),
    removeMember: (teamId: string, userId: string): Promise<void> =>
        api.delete(`/teams/${teamId}/members/${userId}`).then(res => res.data.data || res.data),
    listUsers: () => api.get('/users').then(res => res.data.data || res.data), // Placeholder, assuming this exists
};
