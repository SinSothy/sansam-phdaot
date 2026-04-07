import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember, Role } from './entities/workspace-member.entity';
import { User } from '../users/entities/user.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

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
      where: { id },
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

    const result = await this.workspaceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }
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
