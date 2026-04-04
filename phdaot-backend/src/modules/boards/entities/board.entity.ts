import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Task } from '../../tasks/entities/task.entity';

export enum BoardVisibility {
  WORKSPACE = 'workspace',
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export enum BoardStatus {
  ACTIVE = 'active',
  UPDATING = 'updating',
  ARCHIVED = 'archived',
}

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('uuid')
  workspace_id: string;

  @Column({
    type: 'enum',
    enum: BoardVisibility,
    default: BoardVisibility.WORKSPACE,
  })
  visibility: BoardVisibility;

  @Column({ nullable: true })
  background: string;

  @Column({ default: false })
  is_image: boolean;

  @Column({
    type: 'enum',
    enum: BoardStatus,
    default: BoardStatus.ACTIVE,
  })
  status: BoardStatus;

  @ManyToOne(() => Workspace, (workspace) => workspace.boards)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @OneToMany(() => Task, (task) => task.board)
  tasks: Task[];

  @CreateDateColumn()
  created_at: Date;
}
