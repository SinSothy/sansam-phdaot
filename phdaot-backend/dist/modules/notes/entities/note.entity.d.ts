import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
export interface NoteAttachment {
    url: string;
    type: string;
    name: string;
}
export declare class Note {
    id: string;
    content: string;
    attachments: NoteAttachment[];
    author_id: string;
    workspace_id: string;
    author: User;
    workspace: Workspace;
    created_at: Date;
}
