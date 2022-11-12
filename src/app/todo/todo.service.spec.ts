import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ task: 'ta1', isDone: 1 }),
  new TodoEntity({ task: 'ta2', isDone: 0 }),
  new TodoEntity({ task: 'ta3', isDone: 1 }),
  new TodoEntity({ task: 'ta4', isDone: 0 }),
];

const updateTodoEntity = new TodoEntity({ task: 'ta1', isDone: 0 });

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
            create: jest.fn().mockReturnValue(todoEntityList[0]), //Return não resolve pq ele retorna uma entidade
            save: jest.fn().mockResolvedValue(todoEntityList[0]),
            softDelete: jest.fn().mockReturnValue(undefined),
            merge: jest.fn().mockReturnValue(updateTodoEntity), // recebe uma entidade e um dado e mergeia
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

      expect(todoService.findOne(1)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a todo Entity succefully', async () => {
      const body: CreateTodoDto = {
        task: 'ta1',
        isDone: 1,
      };

      const result = await todoService.create(body);

      expect(result).toEqual(todoEntityList[0]); // Epero q ele me retorne uma entidade
      expect(todoRepository.create).toHaveBeenCalledTimes(1);
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
      expect(todoRepository.create).toHaveBeenCalledWith(body);
      expect(todoRepository.save).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      const body: CreateTodoDto = {
        task: 'ta1',
        isDone: 1,
      };

      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      expect(todoService.create(body)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should to update a todo item', async () => {
      const body: UpdateTodoDto = {
        task: 'ta1',
        isDone: 0,
      };

      jest
        .spyOn(todoRepository, 'save') // Como já fiz o mock do save eu faço esse aqui
        .mockResolvedValueOnce(updateTodoEntity); // mockou aqui pq o save já tá definido

      const result = await todoService.update(1, body);

      expect(result).toEqual(updateTodoEntity);
      expect(todoRepository.merge).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      const body: UpdateTodoDto = {
        task: 'ta1',
        isDone: 0,
      };

      jest
        .spyOn(todoRepository, 'findOneBy')
        .mockRejectedValueOnce(new Error());

      expect(todoService.update(1, body)).rejects.toThrow();
    });

    it('should throw an exeption', () => {
      const body: UpdateTodoDto = {
        task: 'ta1',
        isDone: 0,
      };

      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      expect(todoService.update(1, body)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should delette a todo entity succefully', async () => {
      const result = await todoService.delete(1);

      expect(result).toBeUndefined();
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exeption', async () => {
      jest
        .spyOn(todoRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());

      expect(todoService.delete(1)).rejects.toThrowError();
    });

    it('should a not found todo entity', () => {
      jest
        .spyOn(todoRepository, 'findOneBy')
        .mockRejectedValueOnce(new Error());

      expect(todoService.delete(1)).rejects.toThrowError();
    });
  });
});
