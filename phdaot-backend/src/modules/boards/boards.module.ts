import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardColumn } from './entities/board-column.entity';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardColumn]),
    forwardRef(() => WorkspacesModule),
  ],
  providers: [BoardsService],
  controllers: [BoardsController],
  exports: [BoardsService, TypeOrmModule],
})
export class BoardsModule {}
