import { Workspace } from '../../workspaces/entities/workspace.entity';
export declare class Project {
    id: string;
    name: string;
    workspace_id: string;
    workspace: Workspace;
    created_at: Date;
}
