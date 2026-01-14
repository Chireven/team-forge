import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@team-forge/shared/data-access';
import { Project } from './project.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  assigneeId?: string;

  @Column()
  projectId!: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    default: TaskStatus.TODO,
  })
  status!: TaskStatus;

  @Column({ type: 'datetime2', nullable: true })
  startDate?: Date;

  @Column({ type: 'datetime2', nullable: true })
  dueDate?: Date;

  @Column({ type: 'float', default: 0 })
  estimatedHours!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigneeId' })
  assignee?: User;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'projectId' })
  project!: Project;
}
