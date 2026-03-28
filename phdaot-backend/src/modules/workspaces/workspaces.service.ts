import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember, Role } from './entities/workspace-member.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private readonly memberRepository: Repository<WorkspaceMember>,
  ) {}

  async create(userId: string, createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    const workspace = this.workspaceRepository.create(createWorkspaceDto);
    const savedWorkspace = await this.workspaceRepository.save(workspace);

    // Add creator as OWNER
    const member = this.memberRepository.create({
      user_id: userId,
      workspace_id: savedWorkspace.id,
      role: Role.OWNER,
    });
    await this.memberRepository.save(member);

    return savedWorkspace;
  }

  async findAll(userId: string): Promise<Workspace[]> {
    return this.workspaceRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace_members', 'member', 'member.workspace_id = workspace.id')
      .where('member.user_id = :userId', { userId })
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository
      .createQueryBuilder('workspace')
      .innerJoin('workspace_members', 'member', 'member.workspace_id = workspace.id')
      .where('workspace.id = :id', { id })
      .andWhere('member.user_id = :userId', { userId })
      .getOne();

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${id}" not found or access denied`);
    }

    return workspace;
  }

  async update(id: string, userId: string, updateWorkspaceDto: UpdateWorkspaceDto): Promise<Workspace> {
    const member = await this.memberRepository.findOne({
      where: { workspace_id: id, user_id: userId },
    });

    if (!member || (member.role !== Role.OWNER && member.role !== Role.ADMIN)) {
      throw new ForbiddenException('Only owners and admins can update workspace settings');
    }

    const workspace = await this.findOne(id, userId);
    Object.assign(workspace, updateWorkspaceDto);
    return this.workspaceRepository.save(workspace);
  }

  async remove(id: string, userId: string): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: { workspace_id: id, user_id: userId },
    });

    if (!member || member.role !== Role.OWNER) {
      throw new ForbiddenException('Only the owner can delete the workspace');
    }

    const result = await this.workspaceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Workspace with ID "${id}" not found`);
    }
  }

  async getMembers(id: string, userId: string): Promise<WorkspaceMember[]> {
    // Ensure user has access
    await this.findOne(id, userId);

    return this.memberRepository.find({
      where: { workspace_id: id },
      relations: ['user'],
    });
  }
}
