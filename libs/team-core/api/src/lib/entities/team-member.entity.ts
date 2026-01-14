import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from './team.entity';
import { User } from '@team-forge/shared/data-access';

export enum TeamRole {
  LEAD = 'LEAD',
  MEMBER = 'MEMBER',
}

export enum AvailabilityStatus {
  ACTIVE = 'ACTIVE',
  AWAY = 'AWAY',
}

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  teamId!: string;

  @Column()
  userId!: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    default: TeamRole.MEMBER,
  })
  role!: TeamRole;

  @Column({
    type: 'nvarchar',
    length: 20,
    default: AvailabilityStatus.ACTIVE,
  })
  availabilityStatus!: AvailabilityStatus;

  @Column({
    type: 'int',
    default: 0,
  })
  allocationPercent!: number;

  @ManyToOne(() => Team, (team) => team.members)
  @JoinColumn({ name: 'teamId' })
  team!: Team;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
