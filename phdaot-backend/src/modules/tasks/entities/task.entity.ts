import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  TESTING = 'TESTING',
  DONE = 'DONE',
  DELETED = 'DELETED',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({ type: 'int', default: 0 })
  order_position: number;

  @Column('uuid')
  project_id: string;

  @Column('uuid', { nullable: true })
  board_id: string;

  @Column('uuid', { nullable: true })
  assignee_id: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Board, (board) => board.tasks)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @CreateDateColumn()
  created_at: Date;
}
