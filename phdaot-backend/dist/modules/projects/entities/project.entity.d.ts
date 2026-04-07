import { Workspace } from '../../workspaces/entities/workspace.entity';
export declare enum ProjectStatus {
    ACTIVE = "ACTIVE",
    DELETED = "DELETED"
}
export declare class Project {
    id: string;
    name: string;
    status: ProjectStatus;
    workspace_id: string;
    workspace: Workspace;
    created_at: Date;
}
