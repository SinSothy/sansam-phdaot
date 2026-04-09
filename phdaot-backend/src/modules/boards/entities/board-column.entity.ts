import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Board } from './board.entity';
import { Task } from '../../tasks/entities/task.entity';
import { TaskStatus } from '../../tasks/enums/task-status.enum';

@Entity('board_columns')
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int', default: 0 })
  order_position: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column('uuid')
  board_id: string;

  @ManyToOne(() => Board, (board) => board.columns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];

  @CreateDateColumn()
  created_at: Date;
}
