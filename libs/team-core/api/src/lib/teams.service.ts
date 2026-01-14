import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamMember, TeamRole } from './entities/team-member.entity';
import { CreateTeamDto, AddTeamMemberDto } from './dtos/team.dto';

import { User } from '@team-forge/shared/data-access';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private teamRepo: Repository<Team>,
        @InjectRepository(TeamMember)
        private memberRepo: Repository<TeamMember>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async createTeam(dto: CreateTeamDto): Promise<Team> {
        const existing = await this.teamRepo.findOne({ where: { name: dto.name } });
        if (existing) {
            throw new ConflictException('Team name already exists');
        }
        const team = this.teamRepo.create(dto);
        return this.teamRepo.save(team);
    }

    async listTeams(): Promise<any[]> {
        const teams = await this.teamRepo
            .createQueryBuilder('team')
            .loadRelationCountAndMap('team.memberCount', 'team.members')
            .getMany();
        return teams;
    }

    async getTeam(id: string): Promise<Team> {
        const team = await this.teamRepo.findOne({
            where: { id },
            relations: ['members', 'members.user'],
        });
        if (!team) {
            throw new NotFoundException('Team not found');
        }
        return team;
    }

    async addMember(teamId: string, dto: AddTeamMemberDto): Promise<TeamMember> {
        const team = await this.teamRepo.findOne({ where: { id: teamId } });
        if (!team) {
            throw new NotFoundException('Team not found');
        }

        const user = await this.userRepo.findOne({ where: { id: dto.userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const existing = await this.memberRepo.findOne({
            where: { teamId, userId: dto.userId },
        });
        if (existing) {
            throw new ConflictException('User is already a member of this team');
        }
        const member = this.memberRepo.create({
            teamId,
            userId: dto.userId,
            role: dto.role,
            allocationPercent: dto.allocationPercent,
        });
        return this.memberRepo.save(member);
    }

    async removeMember(teamId: string, userId: string): Promise<void> {
        const member = await this.memberRepo.findOne({
            where: { teamId, userId },
        });
        if (!member) {
            throw new NotFoundException('Member not found');
        }
        await this.memberRepo.remove(member);
    }

    async getMembers(teamId: string): Promise<TeamMember[]> {
        return this.memberRepo.find({
            where: { teamId },
            relations: ['user'],
        });
    }
}
