import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';

import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), WorkspacesModule],
  providers: [BoardsService],
  controllers: [BoardsController],
  exports: [BoardsService],
})
export class BoardsModule {}
