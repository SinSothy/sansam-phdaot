import { User } from '../../users/entities/user.entity';
import { Workspace } from './workspace.entity';
export declare enum Role {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    OBSERVER = "OBSERVER"
}
export declare enum MembershipStatus {
    ACTIVE = "ACTIVE",
    DELETED = "DELETED"
}
export declare class WorkspaceMember {
    user_id: string;
    workspace_id: string;
    status: MembershipStatus;
    user: User;
    workspace: Workspace;
    role: Role;
}
