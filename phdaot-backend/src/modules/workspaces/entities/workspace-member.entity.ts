import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Workspace } from './workspace.entity';

export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  OBSERVER = 'OBSERVER',
}

@Entity('workspace_members')
export class WorkspaceMember {
  @PrimaryColumn('uuid')
  user_id: string;

  @PrimaryColumn('uuid')
  workspace_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;
}
