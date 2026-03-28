import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { WorkspaceMember, Role } from '../../modules/workspaces/entities/workspace-member.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(WorkspaceMember)
    private memberRepository: Repository<WorkspaceMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user, params } = context.switchToHttp().getRequest();
    const workspaceId = params.id || params.workspaceId;

    if (!user || !workspaceId) {
      return false;
    }

    const member = await this.memberRepository.findOne({
      where: {
        workspace_id: workspaceId,
        user_id: user.id,
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    const hasRole = requiredRoles.some((role) => member.role === role);
    if (!hasRole) {
      throw new ForbiddenException(`You do not have the required role: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
