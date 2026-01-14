import { User } from '../entities/user.entity';

export interface TeamMember {
    id: string;
    teamId: string;
    userId: string;
    role: 'LEAD' | 'MEMBER';
    allocationPercent: number;
    user: User;
}

export interface AddTeamMemberRequest {
    userId: string;
    role: 'LEAD' | 'MEMBER';
    allocationPercent: number;
}
