import { Board } from '../../boards/entities/board.entity';
import { WorkspaceMember } from './workspace-member.entity';
export declare class Workspace {
    id: string;
    name: string;
    description: string;
    slug: string;
    logo_url: string;
    created_at: Date;
    boards: Board[];
    members: WorkspaceMember[];
}
