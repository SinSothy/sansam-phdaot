import { Project } from '../../projects/entities/project.entity';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entities/user.entity';
export declare enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    TESTING = "TESTING",
    DONE = "DONE"
}
export declare class Task {
    id: string;
    title: string;
    status: TaskStatus;
    order_position: number;
    project_id: string;
    board_id: string;
    assignee_id: string;
    project: Project;
    board: Board;
    assignee: User;
    created_at: Date;
}
