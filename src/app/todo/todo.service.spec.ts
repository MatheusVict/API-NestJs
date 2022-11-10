import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  it('1 + 1', () => {
    expect(1 + 1).toEqual(2);
  });
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService, // Inejeção de repositorio padrão
        {
          provide: getRepositoryToken(TodoEntity), // Retorna ua classe de repositorio com os metodos
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            softDelete: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  /*('findAll', () => {
    it('should return a todo list Entity succefully',async () => {
      
    });
  });*/
});
