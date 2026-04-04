import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(userId: string, createBoardDto: CreateBoardDto): Promise<Board> {
    // TODO: Verify if user has access to the workspace
    const board = this.boardRepository.create(createBoardDto);
    return this.boardRepository.save(board);
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
      relations: ['workspace'] 
    });
    if (!board) {
      throw new NotFoundException(`Board with ID "${id}" not found`);
    }
    return board;
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
