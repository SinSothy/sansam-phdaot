import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesGateway } from './gateways/workspaces.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, WorkspaceMember])],
  providers: [WorkspacesService, WorkspacesGateway],
  controllers: [WorkspacesController],
  exports: [WorkspacesService, WorkspacesGateway, TypeOrmModule],
})
export class WorkspacesModule {}
