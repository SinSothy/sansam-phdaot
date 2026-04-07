import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

export interface NoteAttachment {
  url: string;
  type: string;
  name: string;
}

export enum NoteStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NoteStatus,
    default: NoteStatus.ACTIVE,
  })
  status: NoteStatus;

  @Column('text')
  content: string;

  @Column({ type: 'jsonb', default: [] })
  attachments: NoteAttachment[];

  @Column('uuid')
  author_id: string;

  @Column('uuid')
  workspace_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @CreateDateColumn()
  created_at: Date;
}
