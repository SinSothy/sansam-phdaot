import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Workspace, WorkspaceStatus } from './entities/workspace.entity';
import { WorkspaceMember, Role, MembershipStatus } from './entities/workspace-member.entity';
import { User } from '../users/entities/user.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Board, BoardStatus } from '../boards/entities/board.entity';
import { Task, TaskStatus } from '../tasks/entities/task.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Note, NoteStatus } from '../notes/entities/note.entity';
import { Not } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private readonly memberRepository: Repository<WorkspaceMember>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      // 1. Verify user exists
      const user = await transactionalEntityManager.findOne(User, {
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found. Cannot create workspace.`);
      }

      // 2. Create and save workspace
      const workspace = transactionalEntityManager.create(Workspace, createWorkspaceDto);
      const savedWorkspace = await transactionalEntityManager.save(workspace);

      // 3. Add creator as OWNER
      const member = transactionalEntityManager.create(WorkspaceMember, {
        user_id: userId,
        workspace_id: savedWorkspace.id,
        role: Role.OWNER,
      });
      await transactionalEntityManager.save(member);

      return savedWorkspace;
    });
  }

  async findAll(userId: string): Promise<Workspace[]> {
    // Bypassed for testing with Swagger - added eager loading for boards
    return this.workspaceRepository.find({
      where: { status: Not(WorkspaceStatus.DELETED) },
      relations: ['boards'],
      order: { created_at: 'DESC' }
    });
    /*
    return this.workspaceRepository
      .createQueryBuilder('workspace')
      .leftJoinAndSelect('workspace.boards', 'boards')
      .innerJoin('workspace_members', 'member', 'member.workspace_id = workspace.id')
      .where('member.user_id = :userId', { userId })
      .getMany();
    */
  }

  async findOne(id: string, userId: string): Promise<Workspace> {
    // Bypassed for testing with Swagger - added eager loading for boards
    const workspace = await this.workspaceRepository.findOne({ 
      where: { id, status: Not(WorkspaceStatus.DELETED) },
      relations: ['boards']
    });
    /*
    const workspace = await this.workspaceRepository
      .createQueryBuilder('workspace')
      .leftJoinAndSelect('workspace.boards', 'boards')
      .innerJoin('workspace_members', 'member', 'member.workspace_id = workspace.id')
      .where('workspace.id = :id', { id })
      .andWhere('member.user_id = :userId', { userId })
      .getOne();
    */

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }

    return workspace;
  }

  async update(id: string, userId: string, updateWorkspaceDto: UpdateWorkspaceDto): Promise<Workspace> {
    /* Bypassed for testing with Swagger
    const member = await this.memberRepository.findOne({
      where: { workspace_id: id, user_id: userId },
    });

    if (!member || (member.role !== Role.OWNER && member.role !== Role.ADMIN)) {
      throw new ForbiddenException('Only owners and admins can update workspace settings');
    }
    */

    const workspace = await this.findOne(id, userId);
    Object.assign(workspace, updateWorkspaceDto);
    return this.workspaceRepository.save(workspace);
  }

  async remove(id: string, userId: string): Promise<void> {
    /* Bypassed for testing with Swagger
    const member = await this.memberRepository.findOne({
      where: { workspace_id: id, user_id: userId },
    });

    if (!member || member.role !== Role.OWNER) {
      throw new ForbiddenException('Only the owner can delete the workspace');
    }
    */

    await this.dataSource.transaction(async (manager) => {
      // 1. Mark Workspace as DELETED
      const workspace = await manager.findOne(Workspace, { where: { id } });
      if (!workspace) throw new NotFoundException(`Workspace with ID "${id}" not found`);
      
      workspace.status = WorkspaceStatus.DELETED;
      await manager.save(workspace);

      // 2. Mark Members as DELETED
      await manager.update(WorkspaceMember, { workspace_id: id }, { status: MembershipStatus.DELETED });

      // 3. Mark Projects as DELETED
      await manager.update(Project, { workspace_id: id }, { status: ProjectStatus.DELETED });

      // 4. Mark Notes as DELETED
      await manager.update(Note, { workspace_id: id }, { status: NoteStatus.DELETED });

      // 5. Mark Boards and their Tasks as DELETED
      const boards = await manager.find(Board, { where: { workspace_id: id } });
      for (const board of boards) {
        board.status = BoardStatus.DELETED;
        await manager.save(board);
        
        await manager.update(Task, { board_id: board.id }, { status: TaskStatus.DELETED });
      }
    });
  }

  async getMembers(id: string, userId: string): Promise<WorkspaceMember[]> {
    // Ensure user has access - Bypassed for testing
    // await this.findOne(id, userId);

    return this.memberRepository.find({
      where: { workspace_id: id },
      relations: ['user'],
    });
  }
}
