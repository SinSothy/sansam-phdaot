import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardColumn } from './entities/board-column.entity';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';

import { WorkspacesGateway } from '../workspaces/gateways/workspaces.gateway';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardColumn)
    private readonly columnRepository: Repository<BoardColumn>,
    @Inject(forwardRef(() => WorkspacesGateway))
    private readonly workspacesGateway: WorkspacesGateway,
  ) {}

  async create(userId: string, createBoardDto: CreateBoardDto): Promise<Board> {
    // TODO: Verify if user has access to the workspace
    const board = this.boardRepository.create(createBoardDto);
    const savedBoard = await this.boardRepository.save(board);
    
    // @SeniorOptimization: Notify clients via WebSockets
    this.workspacesGateway.emitBoardCreated(savedBoard);
    
    return savedBoard;
  }

  async findAll(workspaceId?: string): Promise<Board[]> {
    const where = workspaceId ? { workspace_id: workspaceId } : {};
    return this.boardRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardRepository.findOne({ 
      where: { id },
      relations: ['workspace', 'columns', 'columns.tasks'] 
    });
    if (!board) {
      throw new NotFoundException(`Board with ID "${id}" not found`);
    }
    return board;
  }

  /**
   * Create a new column in a board.
   */
  async createColumn(boardId: string, title: string): Promise<BoardColumn> {
    const board = await this.findOne(boardId);
    
    // Calculate order_position
    const count = await this.columnRepository.count({ where: { board_id: boardId } });
    
    const column = this.columnRepository.create({
      title,
      board_id: boardId,
      order_position: count,
    });
    
    const savedColumn = await this.columnRepository.save(column);
    
    return savedColumn;
  }

  /**
   * Remove a column from a board.
   */
  async removeColumn(boardId: string, columnId: string): Promise<void> {
    const board = await this.findOne(boardId);
    const result = await this.columnRepository.delete({ id: columnId, board_id: boardId });
    
    if (result.affected !== 0) {
      // Broadcast via WebSockets handled by Gateway
    }
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const board = await this.findOne(id);
    Object.assign(board, updateBoardDto);
    return this.boardRepository.save(board);
  }

  async remove(id: string): Promise<void> {
    const result = await this.boardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Board with ID "${id}" not found`);
    }
  }
}
