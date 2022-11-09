import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll() {
    return await this.todoRepository.find();
  }

  async findOne(id: number) {
    try {
      const todo = await this.todoRepository.findOneBy({ id });

      if (!todo) {
        return response.json('Não encontrado');
      }

      return todo;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: CreateTodoDto) {
    return await this.todoRepository.save(this.todoRepository.create(data));
  }

  async update(id: number, data: UpdateTodoDto) {
    const todo = await this.todoRepository.findOneBy({ id });

    this.todoRepository.merge(todo, data);

    return await this.todoRepository.save(todo);
  }

  async delete(id: number) {
    await this.todoRepository.findOneBy({ id });

    await this.todoRepository.softDelete(id);
  }
}
