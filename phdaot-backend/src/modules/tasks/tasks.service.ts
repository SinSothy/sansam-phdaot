import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { BoardColumn } from '../boards/entities/board-column.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(BoardColumn)
    private readonly columnRepository: Repository<BoardColumn>,
  ) {}

  async create(boardId: string, status: TaskStatus, title: string): Promise<Task> {
    // Find the column for this status in the board to ensure it's linked
    const column = await this.columnRepository.findOne({
      where: { board_id: boardId, status },
    });

    // Calculate order position (at the end of the column)
    const count = await this.taskRepository.count({
      where: { board_id: boardId, status },
    });

    const task = this.taskRepository.create({
      title,
      status,
      board_id: boardId,
      column_id: column?.id,
      order_position: count,
    });

    return this.taskRepository.save(task);
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    
    // If status changed, we might need to update column_id as well
    if (updates.status && updates.status !== task.status) {
      const column = await this.columnRepository.findOne({
        where: { board_id: task.board_id, status: updates.status },
      });
      if (column) {
        updates.column_id = column.id;
      }
    }

    Object.assign(task, updates);
    return this.taskRepository.save(task);
  }

  async move(taskId: string, sourceStatus: TaskStatus, destStatus: TaskStatus, newIndex: number): Promise<Task> {
    const task = await this.findOne(taskId);
    
    // Simplistic move: update status and column_id
    task.status = destStatus;
    const column = await this.columnRepository.findOne({
      where: { board_id: task.board_id, status: destStatus },
    });
    if (column) {
      task.column_id = column.id;
    }
    task.order_position = newIndex; // Real world would require reordering others

    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ 
      where: { id },
      relations: ['board'] 
    });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    return task;
  }
}
