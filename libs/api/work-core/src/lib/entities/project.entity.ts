import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Team } from '@team-forge/team-core-api';
import { Task } from './task.entity';

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  teamId!: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    default: ProjectStatus.ACTIVE,
  })
  status!: ProjectStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'teamId' })
  team!: Team;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];
}
