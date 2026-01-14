import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { TeamMember } from './team-member.entity';

@Entity('teams')
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => TeamMember, (member) => member.team)
    members!: TeamMember[];
}
