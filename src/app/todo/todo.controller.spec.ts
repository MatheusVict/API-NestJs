import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: 1, task: '1', isDone: 0 }),
  new TodoEntity({ id: 2, task: '2', isDone: 1 }),
  new TodoEntity({ id: 3, task: '3', isDone: 1 }),
  new TodoEntity({ id: 4, task: '4', isDone: 0 }),
  new TodoEntity({ id: 5, task: '5', isDone: 1 }),
];

const newTodoEntity = new TodoEntity({ task: 'Testar o endpoint', isDone: 0 });

const updateEntity = new TodoEntity({ task: 'Task', isDone: 1 });

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoEntityList),
            findOne: jest.fn().mockResolvedValue(todoEntityList[0]),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            update: jest.fn().mockResolvedValue(updateEntity),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('handle return todo list Entity succefully', async () => {
      const result = await todoController.index();
      //Act
      expect(result).toEqual(todoEntityList);
      expect(typeof result).toEqual('object');
      expect(result[0].id).toEqual(todoEntityList[0].id);
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
      //Assert
    });

    it('should throw an exception', () => {
      // Mudando a função para quebrar ela e esperar q ela lance um erro
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error()); // spyOn muda a função

      // assert
      expect(todoController.index()).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new todo item succefully', async () => {
      const body: CreateTodoDto = {
        task: 'Testar o endpoint',
        isDone: 0,
      };

      const result = await todoController.create(body);

      expect(result).toEqual(newTodoEntity);
      expect(todoService.create).toHaveBeenCalledTimes(1); // Espero q seja chamado no meu controller tantas vezs
      expect(todoService.create).toHaveBeenCalledWith(body); //Espero q seja chamado com um paramêtro tal
    });

    it('should throw an exception', () => {
      const body: CreateTodoDto = {
        task: 'Testar o endpoint',
        isDone: 0,
      };

      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());

      expect(todoController.create(body)).rejects.toThrow();
    });

    describe('show', () => {
      it('should get a todo intem succefully', async () => {
        const result = await todoController.show('1');

        expect(result).toEqual(todoEntityList[0]);
        expect(todoService.findOne).toHaveBeenCalledTimes(1);
        expect(todoService.findOne).toHaveBeenCalledWith(1);
      });

      it('should throw an exception', () => {
        jest.spyOn(todoService, 'findOne').mockRejectedValueOnce(new Error());

        expect(todoController.show('1')).rejects.toThrow();
      });
    });

    describe('update', () => {
      const body: UpdateTodoDto = {
        task: 'Task',
        isDone: 1,
      };

      it('should update a todo item succefully', async () => {
        const result = await todoController.update('1', body);

        expect(result).toEqual(updateEntity);
        expect(todoService.update).toHaveBeenCalledTimes(1);
        expect(todoService.update).toHaveBeenCalledWith(1, body);
      });

      it('should throw an exception', () => {
        jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());

        expect(todoController.update('1', body)).rejects.toThrow();
      });
    });

    describe('delete', () => {
      it('should delete a todo item succefully', async () => {
        const result = await todoController.destroy('1');

        expect(result).toBeUndefined();
      });

      it('should throw an exception', () => {
        jest.spyOn(todoService, 'delete').mockRejectedValueOnce(new Error());

        expect(todoController.destroy('1')).rejects.toThrow();
      });
    });
  });
});
