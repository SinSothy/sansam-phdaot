import { Project } from '../../projects/entities/project.entity';
import { Board } from '../../boards/entities/board.entity';
import { BoardColumn } from '../../boards/entities/board-column.entity';
import { User } from '../../users/entities/user.entity';
import { TaskStatus } from '../enums/task-status.enum';
export declare class Task {
    id: string;
    title: string;
    status: TaskStatus;
    order_position: number;
    project_id: string;
    board_id: string;
    column_id: string;
    assignee_id: string;
    project: Project;
    board: Board;
    column: BoardColumn;
    assignee: User;
    created_at: Date;
}
