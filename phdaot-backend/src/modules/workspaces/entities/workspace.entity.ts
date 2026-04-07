import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';
import { WorkspaceMember } from './workspace-member.entity';

export enum WorkspaceStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: WorkspaceStatus,
    default: WorkspaceStatus.ACTIVE,
  })
  status: WorkspaceStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logo_url: string;
  
  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Board, (board) => board.workspace)
  boards: Board[];

  @OneToMany(() => WorkspaceMember, (member) => member.workspace)
  members: WorkspaceMember[];
}
