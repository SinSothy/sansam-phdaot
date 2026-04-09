import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { BoardColumn } from '../boards/entities/board-column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, BoardColumn])],
  providers: [TasksService],
  controllers: [],
  exports: [TypeOrmModule, TasksService],
})
export class TasksModule {}
