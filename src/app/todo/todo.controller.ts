import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  async index() {
    return await this.todoService.findAll();
  }

  @Post()
  async create(@Body() body: CreateTodoDto) {
    return this.todoService.create(body);
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    return await this.todoService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTodoDto) {
    return await this.todoService.update(Number(id), body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: string) {
    await this.todoService.delete(Number(id));
  }
}
