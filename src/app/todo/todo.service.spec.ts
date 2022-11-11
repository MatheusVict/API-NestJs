import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ task: 'ta1', isDone: 1 }),
  new TodoEntity({ task: 'ta2', isDone: 0 }),
  new TodoEntity({ task: 'ta3', isDone: 1 }),
  new TodoEntity({ task: 'ta4', isDone: 0 }),
];

const newTodoEntity: TodoEntity = new TodoEntity({
  task: 'Criar task',
  isDone: 1,
});

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: Repository<TodoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService, // Inejeção de repositorio padrão
        {
          provide: getRepositoryToken(TodoEntity), // Retorna uma classe de repositorio com os metodos
          useValue: {
            find: jest.fn().mockResolvedValue(todoEntityList),
            findOneBy: jest.fn().mockResolvedValue(todoEntityList[0]),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            save: jest.fn(),
            softDelete: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<TodoEntity>>(
      getRepositoryToken(TodoEntity),
    );
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
    expect(todoRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a todo list Entity succefully', async () => {
      const result = await todoService.findAll();

      expect(result).toEqual(todoEntityList);
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());

      expect(todoService.findAll).rejects.toThrow();
    });
  });

  describe('finOne', () => {
    it('should return a todo Entity succefully', async () => {
      const result = await todoService.findOne(1);

      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(todoRepository, 'findOneBy')
        .mockRejectedValueOnce(new Error());

      expect(todoService.findOne(1)).rejects.toThrow();
    });
  });

  /*describe('create', () => {
    it('should create a todo Entity succefully', async () => {
      const body: CreateTodoDto = {
        task: 'Criar task',
        isDone: 1,
      };

      const result = await todoService.create(body);

      expect(result).toEqual(newTodoEntity);
    });
  });*/
});
