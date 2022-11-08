import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'todo' })
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  task: string;

  @Column({ name: 'is_done', type: 'tinyint', width: 1 })
  isDone: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
